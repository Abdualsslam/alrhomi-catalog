import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CategoriesService } from './categories.service';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let mockCategoryModel: any;
  let mockProductModel: any;

  const mockCategory = {
    _id: new Types.ObjectId(),
    name: 'Test Category',
    parent: null,
    save: jest.fn(),
    populate: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    mockCategoryModel = {
      find: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([mockCategory]), // lean() is usually the end of the chain
      }),
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
      findById: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockCategory),
      }),
      create: jest.fn().mockResolvedValue(mockCategory),
      findByIdAndUpdate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockCategory),
      }),
      findByIdAndDelete: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCategory),
      }),
    };

    mockProductModel = {
      aggregate: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getModelToken('Category'),
          useValue: mockCategoryModel,
        },
        {
          provide: getModelToken('Product'),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return categories', async () => {
      const result = await service.findAll();
      expect(result.items).toBeDefined();
    });
  });

  describe('create', () => {
    const createDto = {
      name: 'New Category',
    };

    it('should create a category successfully', async () => {
      const result = await service.create(createDto);
      expect(result).toBeDefined();
      expect(mockCategoryModel.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if category already exists', async () => {
      mockCategoryModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCategory),
      });
      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    const updateDto = {
      name: 'Updated Category',
    };

    it('should update a category successfully', async () => {
      const id = new Types.ObjectId().toHexString();
      const result = await service.update(id, updateDto);
      expect(result).toBeDefined();
      expect(mockCategoryModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should throw NotFoundException if category not found', async () => {
      mockCategoryModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.update(new Types.ObjectId().toHexString(), updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a category successfully', async () => {
      const id = new Types.ObjectId().toHexString();
      const result = await service.remove(id);
      expect(result).toEqual({ message: 'تم حذف الفئة' });
      expect(mockCategoryModel.findByIdAndDelete).toHaveBeenCalled();
    });

    it('should throw BadRequestException if category has children', async () => {
      mockCategoryModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'childId' }),
      });
      const id = new Types.ObjectId().toHexString();
      await expect(service.remove(id)).rejects.toThrow(BadRequestException);
    });
  });
});
