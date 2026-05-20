import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductDetailDto, ProductListResponseDto } from './dto/product-response.dto';

@ApiTags('Products - Public')
@Controller('public/products')
export class PublicProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'جلب قائمة المنتجات للعرض العام' })
  @ApiResponse({
    status: 200,
    description: 'قائمة المنتجات مع الصور الأولى',
    type: ProductListResponseDto,
  })
  async findAll(@Query() queryDto: ProductQueryDto) {
    return this.productsService.findAllPublic(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب منتج واحد حسب المعرف' })
  @ApiResponse({
    status: 200,
    description: 'تفاصيل المنتج',
    type: ProductDetailDto,
  })
  @ApiNotFoundResponse({ description: 'المنتج غير موجود' })
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOnePublic(id);
    if (!product) {
      throw new NotFoundException('المنتج غير موجود');
    }
    return product;
  }
}
