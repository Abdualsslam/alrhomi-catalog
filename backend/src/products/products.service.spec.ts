import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
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
    populate: jest.fn().mockReturnThis(),
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

  describe('create', () => {
    const createDto = {
      productName: 'New Product',
      productCode: 'NP001',
      category: new Types.ObjectId().toHexString(),
    };

    it('should create a product successfully', async () => {
      const result = await service.create(createDto);
      expect(result).toBeDefined();
      expect(mockProductModel.create).toHaveBeenCalled();
    });

    it('should throw ConflictException on duplicate code', async () => {
      mockProductModel.create.mockRejectedValue({ code: 11000 });
      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    const updateDto = {
      productName: 'Updated Name',
    };

    it('should update a product successfully', async () => {
      const id = new Types.ObjectId().toHexString();
      const result = await service.update(id, updateDto);
      expect(result).toBeDefined();
      expect(mockProductModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should throw NotFoundException if product to update not found', async () => {
      mockProductModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.update(new Types.ObjectId().toHexString(), updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      const id = new Types.ObjectId().toHexString();
      const result = await service.remove(id);
      expect(result).toEqual({ message: 'تم حذف المنتج' });
      expect(mockProductModel.findByIdAndDelete).toHaveBeenCalled();
    });

    it('should throw BadRequestException if product has images', async () => {
      mockImageModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(5),
      });
      const id = new Types.ObjectId().toHexString();
      await expect(service.remove(id)).rejects.toThrow(BadRequestException);
    });
  });
});
