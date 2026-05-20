import { IsNotEmpty, IsOptional, IsMongoId, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFolderDto {
  @ApiProperty({ description: 'اسم المجلد' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'معرف المجلد الأب (اتركه فارغاً للجذر)' })
  @IsOptional()
  @IsMongoId()
  parentId?: string;
}

export class RenameFolderDto {
  @ApiProperty({ description: 'الاسم الجديد للمجلد' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
