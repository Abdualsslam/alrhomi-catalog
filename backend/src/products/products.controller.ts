import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ProductDetailDto, ProductListResponseDto } from './dto/product-response.dto';
import { MessageResponseDto } from '../common/dto/message-response.dto';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'جلب قائمة المنتجات' })
  @ApiResponse({
    status: 200,
    description: 'قائمة المنتجات',
    type: ProductListResponseDto,
  })
  async findAll(@Query() queryDto: ProductQueryDto) {
    return this.productsService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب منتج واحد' })
  @ApiResponse({
    status: 200,
    description: 'تفاصيل المنتج',
    type: ProductDetailDto,
  })
  @ApiNotFoundResponse({ description: 'المنتج غير موجود' })
  @ApiBadRequestResponse({ description: 'معرف المنتج غير صالح' })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'إنشاء منتج جديد' })
  @ApiResponse({
    status: 201,
    description: 'تم إنشاء المنتج بنجاح',
    type: ProductDetailDto,
  })
  @ApiBadRequestResponse({ description: 'بيانات غير صحيحة' })
  @ApiConflictResponse({ description: 'المنتج موجود مسبقاً' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'تحديث منتج' })
  @ApiResponse({
    status: 200,
    description: 'تم تحديث المنتج بنجاح',
    type: ProductDetailDto,
  })
  @ApiNotFoundResponse({ description: 'المنتج غير موجود' })
  @ApiBadRequestResponse({ description: 'بيانات غير صحيحة أو معرف غير صالح' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف منتج' })
  @ApiResponse({
    status: 200,
    description: 'تم حذف المنتج بنجاح',
    type: MessageResponseDto,
  })
  @ApiBadRequestResponse({ description: 'لا يمكن حذف منتج يحتوي على صور مرتبطة' })
  @ApiNotFoundResponse({ description: 'المنتج غير موجود' })
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
