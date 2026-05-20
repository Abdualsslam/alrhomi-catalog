import { IsOptional, IsMongoId } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FolderQueryDto {
  @ApiPropertyOptional({ description: 'معرف التصنيف لفتح مجلد التصنيف' })
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'معرف المنتج لفتح مجلد المنتج' })
  @IsOptional()
  @IsMongoId()
  productId?: string;
}
