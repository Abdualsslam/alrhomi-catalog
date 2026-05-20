import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { getQueueToken } from '@nestjs/bull';
import { ImagesService } from './images.service';
import { StorageService } from '../storage/storage.service';
import { Types } from 'mongoose';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';

// Selective mocking of fs to avoid breaking other libraries (like AWS SDK)
jest.mock('fs', () => {
  const actualFs = jest.requireActual('fs');
  return {
    ...actualFs,
    existsSync: jest.fn(),
    createReadStream: jest.fn(),
    unlinkSync: jest.fn(),
  };
});

describe('ImagesService', () => {
  let service: ImagesService;
  let mockProductModel: any;
  let mockImageModel: any;
  let mockQueue: any;
  let mockStorageService: any;

  const mockImage = {
    _id: new Types.ObjectId(),
    originalUrl: 'http://test.com/img.jpg',
    watermarkedUrl: '',
    isWatermarked: false,
    status: 'queued',
    save: jest.fn().mockResolvedValue({}),
    get: jest.fn().mockReturnValue(new Date()),
  };

  const mockProduct = {
    _id: new Types.ObjectId(),
    productName: 'Test Product',
  };

  beforeEach(async () => {
    mockProductModel = {
      findById: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProduct),
      }),
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockProduct]),
      }),
    };

    mockImageModel = {
      create: jest.fn().mockResolvedValue(mockImage),
      find: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockImage]),
      }),
      findById: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockImage),
      }),
      countDocuments: jest.fn().mockResolvedValue(1),
    };

    mockQueue = {
      add: jest.fn().mockResolvedValue({ id: 'jobId' }),
      on: jest.fn(),
    };

    mockStorageService = {
      uploadFile: jest.fn().mockResolvedValue('http://test.com/img.jpg'),
      generatePresignedUrl: jest.fn().mockResolvedValue('http://presigned.com'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        {
          provide: getModelToken('Product'),
          useValue: mockProductModel,
        },
        {
          provide: getModelToken('Image'),
          useValue: mockImageModel,
        },
        {
          provide: getQueueToken('image-processing'),
          useValue: mockQueue,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upload', () => {
    const mockFile = {
      path: 'temp/path.jpg',
      originalname: 'test.jpg',
      filename: 'path.jpg',
      mimetype: 'image/jpeg',
    } as any;

    const uploadDto = {
      productId: mockProduct._id.toHexString(),
    };

    it('should upload an image and queue processing', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.createReadStream as jest.Mock).mockReturnValue({});

      const result = await service.upload(mockFile, uploadDto);

      expect(result.message).toBe('Upload queued');
      expect(mockStorageService.uploadFile).toHaveBeenCalled();
      expect(mockQueue.add).toHaveBeenCalled();
      expect(mockImageModel.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if file does not exist', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      await expect(service.upload(mockFile, uploadDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('toggleWatermark', () => {
    it('should toggle isWatermarked property', async () => {
      const id = mockImage._id.toHexString();
      const result = await service.toggleWatermark(id);

      expect(result.isWatermarked).toBe(true);
      expect(mockImage.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if image not found', async () => {
      mockImageModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.toggleWatermark(new Types.ObjectId().toHexString())).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated images', async () => {
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.items).toBeDefined();
      expect(result.totalItems).toBe(1);
    });
  });
});
