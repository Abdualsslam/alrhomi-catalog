import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ImageListItemDto {
  @ApiProperty({ example: '665f1f77bcf86cd799439099' })
  _id!: string;

  @ApiPropertyOptional({ example: 'Accessories' })
  category?: string;

  @ApiPropertyOptional({ example: 'iPhone 14' })
  model?: string;

  @ApiPropertyOptional({ example: 'Lightning Cable' })
  productName?: string;

  @ApiProperty({ example: 'https://bucket.s3.region.amazonaws.com/originals/file.jpg' })
  originalUrl!: string;

  @ApiPropertyOptional({ example: 'https://bucket.s3.region.amazonaws.com/watermarked/file.png' })
  watermarkedUrl?: string;

  @ApiProperty({ example: true })
  isWatermarked!: boolean;

  @ApiPropertyOptional({ example: 'completed' })
  status?: string;

  @ApiPropertyOptional({ example: 100 })
  progress?: number;
}

export class ImageListResponseDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 3 })
  totalPages!: number;

  @ApiProperty({ example: 50 })
  totalItems!: number;

  @ApiProperty({ type: [ImageListItemDto] })
  items!: ImageListItemDto[];
}

export class UploadImageResponseDto {
  @ApiProperty({ example: 'Upload queued' })
  message!: string;

  @ApiProperty({ example: '665f1f77bcf86cd799439099' })
  id!: string;

  @ApiProperty({ example: '42' })
  jobId!: string;

  @ApiProperty({ example: 'https://bucket.s3.region.amazonaws.com/originals/file.jpg' })
  originalUrl!: string;
}

export class DownloadUrlResponseDto {
  @ApiProperty({
    example: 'https://bucket.s3.region.amazonaws.com/originals/file.jpg?X-Amz-Signature=...',
  })
  url!: string;
}

export class ToggleWatermarkResponseDto {
  @ApiProperty({ example: '665f1f77bcf86cd799439099' })
  id!: string;

  @ApiProperty({ example: true })
  isWatermarked!: boolean;
}

export class QueueStatusResponseDto {
  @ApiProperty({
    example: {
      waiting: 2,
      active: 1,
      completed: 10,
      failed: 0,
      delayed: 0,
      paused: 0,
    },
  })
  counts!: Record<string, number>;

  @ApiProperty({ type: [Object] })
  waiting!: Record<string, unknown>[];

  @ApiProperty({ type: [Object] })
  active!: Record<string, unknown>[];

  @ApiProperty({ type: [Object] })
  completed!: Record<string, unknown>[];

  @ApiProperty({ type: [Object] })
  failed!: Record<string, unknown>[];
}

export class RelatedImagesResponseDto {
  @ApiProperty({ type: [ImageListItemDto] })
  items!: ImageListItemDto[];
}
