import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Folder, FolderDocument } from '../database/schemas/folder.schema';
import { Image, ImageDocument } from '../database/schemas/image.schema';
import { CreateFolderDto, RenameFolderDto } from './dto/folder.dto';

@Injectable()
export class FoldersService {
  constructor(
    @InjectModel(Folder.name) private folderModel: Model<FolderDocument>,
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
  ) {}

  async create(dto: CreateFolderDto): Promise<FolderDocument> {
    return this.folderModel.create({
      name: dto.name,
      parent: dto.parentId || null,
    });
  }

  async getContents(parentId: string | null) {
    // 1. جلب المجلدات الفرعية
    const folders = await this.folderModel.find({ parent: parentId }).sort({ name: 1 }).exec();

    // 2. جلب الصور في هذا المجلد
    const images = await this.imageModel.find({ folder: parentId }).sort({ createdAt: -1 }).exec();

    return { folders, images };
  }

  async rename(id: string, dto: RenameFolderDto): Promise<FolderDocument | null> {
    return this.folderModel.findByIdAndUpdate(id, { name: dto.name }, { new: true });
  }

  async delete(id: string): Promise<void> {
    // نقل الصور الموجودة في المجلد للجذر (null)
    await this.imageModel.updateMany({ folder: id }, { folder: null });

    // نقل المجلدات الفرعية للجذر
    await this.folderModel.updateMany({ parent: id }, { parent: null });

    // حذف المجلد
    await this.folderModel.findByIdAndDelete(id);
  }

  async findById(id: string): Promise<FolderDocument | null> {
    return this.folderModel.findById(id).exec();
  }

  async getBreadcrumbs(
    folderId: string | null,
  ): Promise<Array<{ id: string | null; name: string }>> {
    const breadcrumbs: Array<{ id: string | null; name: string }> = [{ id: null, name: 'الملفات' }];

    if (!folderId) return breadcrumbs;

    const path: FolderDocument[] = [];
    let currentId: string | null = folderId;

    while (currentId) {
      const folder = await this.folderModel.findById(currentId).exec();
      if (!folder) break;
      path.unshift(folder);
      currentId = folder.parent?.toString() || null;
    }

    for (const folder of path) {
      breadcrumbs.push({ id: (folder._id as any).toString(), name: folder.name });
    }

    return breadcrumbs;
  }
}
