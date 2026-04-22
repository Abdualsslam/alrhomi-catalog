import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductListItemDto {
  @ApiProperty({ example: '665f1f77bcf86cd799439099' })
  _id!: string;

  @ApiPropertyOptional({ example: 'Accessories' })
  category?: string;

  @ApiPropertyOptional({ example: 'Chargers' })
  subcategory?: string;

  @ApiPropertyOptional({ example: 'iPhone 14' })
  model?: string;

  @ApiProperty({ example: 'Lightning Cable' })
  productName!: string;

  @ApiProperty({ example: 'APL-CBL-01' })
  productCode!: string;

  @ApiPropertyOptional({ example: 'Durable cable' })
  description?: string;

  @ApiProperty({ example: 3 })
  imageCount!: number;

  @ApiProperty({ example: '2026-04-15T10:00:00.000Z' })
  createdAt!: Date;
}

export class ProductImageDto {
  @ApiProperty({ example: '665f1f77bcf86cd79943909a' })
  _id!: string;

  @ApiProperty({ example: 'https://bucket.s3.region.amazonaws.com/originals/file.jpg' })
  originalUrl!: string;

  @ApiProperty({ example: 'https://bucket.s3.region.amazonaws.com/watermarked/file.png' })
  watermarkedUrl!: string;

  @ApiProperty({ example: true })
  isWatermarked!: boolean;

  @ApiProperty({ example: 'completed' })
  status!: string;
}

export class ProductDetailDto extends ProductListItemDto {
  @ApiProperty({ type: [ProductImageDto] })
  images!: ProductImageDto[];
}

export class ProductListResponseDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;

  @ApiProperty({ example: 98 })
  totalItems!: number;

  @ApiProperty({ example: 12 })
  withoutImagesCount!: number;

  @ApiProperty({ type: [ProductListItemDto] })
  items!: ProductListItemDto[];
}
