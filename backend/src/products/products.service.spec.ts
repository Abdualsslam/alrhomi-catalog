import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductModel: any;
  let mockImageModel: any;

  const mockProduct = {
    _id: new Types.ObjectId(),
    productName: 'Test Product',
    productCode: 'TP001',
    category: { name: 'Test Cat' },
    images: [],
    get: jest.fn().mockReturnValue(new Date()),
    save: jest.fn(),
  };

  beforeEach(async () => {
    mockProductModel = {
      find: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockProduct]),
      }),
      countDocuments: jest.fn().mockResolvedValue(1), // Directly returns value for await
      findById: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProduct),
      }),
      findOne: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      }),
      create: jest.fn().mockResolvedValue(mockProduct),
      findByIdAndUpdate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProduct),
      }),
      findByIdAndDelete: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProduct),
      }),
      updateMany: jest.fn().mockResolvedValue({ nModified: 1 }),
      distinct: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
    };

    mockImageModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      }),
      updateMany: jest.fn().mockResolvedValue({ nModified: 1 }),
      countDocuments: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(0), // Returns object with exec
      }),
      distinct: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken('Product'),
          useValue: mockProductModel,
        },
        {
          provide: getModelToken('Image'),
          useValue: mockImageModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.items).toBeDefined();
      expect(result.totalItems).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      const id = mockProduct._id.toHexString();
      const result = await service.findOne(id);
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.findOne(new Types.ObjectId().toHexString())).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
