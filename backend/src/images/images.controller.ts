import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as path from 'path';
import { ImagesService } from './images.service';
import { UploadImageDto } from './dto/upload-image.dto';
import { ImageQueryDto } from './dto/image-query.dto';
import { FolderQueryDto } from './dto/folder-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import {
  DownloadUrlResponseDto,
  ImageListResponseDto,
  QueueStatusResponseDto,
  ToggleWatermarkResponseDto,
  UploadImageResponseDto,
} from './dto/image-response.dto';

@ApiTags('Images')
@Controller('images')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
@ApiForbiddenResponse({ description: 'Admin role required for selected endpoints' })
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          // Sanitize filename to avoid directory traversal or weird characters
          const cleanExt = path.extname(file.originalname).replace(/[^a-zA-Z0-9.]/g, '');
          cb(null, file.fieldname + '-' + uniqueSuffix + cleanExt);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, cb) => {
        if (
          !file.originalname.match(/\.(jpg|jpeg|png|webp)$/i) ||
          !file.mimetype.match(/^image\/(jpeg|png|webp)$/i)
        ) {
          return cb(
            new BadRequestException('صيغة الملف غير مدعومة. فقط (JPG, PNG, WEBP) مسموحة.'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'رفع صورة جديدة' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        productId: {
          type: 'string',
        },
      },
      required: ['file'],
    },
  })
  @ApiCreatedResponse({ description: 'تم رفع الصورة بنجاح', type: UploadImageResponseDto })
  @ApiBadRequestResponse({ description: 'الملف غير صالح أو لم يتم رفع ملف' })
  async upload(@UploadedFile() file: Express.Multer.File, @Body() uploadDto: UploadImageDto) {
    if (!file) {
      throw new BadRequestException('لم يتم رفع ملف');
    }
    console.log(
      `[${new Date().toISOString()}] Upload started: ${file.originalname} (${file.size} bytes)`,
    );
    try {
      const result = await this.imagesService.upload(file, uploadDto);
      console.log(
        `[${new Date().toISOString()}] Upload completed: ${file.originalname}, Image ID: ${result.id}, Job ID: ${result.jobId}`,
      );
      return result;
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Upload failed: ${file.originalname}`, error);
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'جلب قائمة الصور' })
  @ApiOkResponse({ description: 'قائمة الصور', type: ImageListResponseDto })
  async findAll(@Query() queryDto: ImageQueryDto) {
    return this.imagesService.findAll(queryDto);
  }

  @Get('queue/status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'الحصول على حالة طابور المعالجة' })
  @ApiOkResponse({ description: 'حالة الطابور', type: QueueStatusResponseDto })
  async getQueueStatus() {
    return this.imagesService.getQueueStatus();
  }

  @Get('folders')
  @ApiOperation({ summary: 'تصفح الصور بنظام المجلدات' })
  @ApiOkResponse({ description: 'هيكل المجلدات او الملفات', schema: { type: 'object' } })
  async getFolders(@Query() query: FolderQueryDto) {
    return this.imagesService.getFolderStructure(query);
  }

  @Get(':id/download-url')
  @ApiOperation({ summary: 'الحصول على رابط التحميل المؤقت' })
  @ApiOkResponse({ description: 'رابط التحميل المؤقت', type: DownloadUrlResponseDto })
  @ApiNotFoundResponse({ description: 'الصورة غير موجودة' })
  @ApiBadRequestResponse({ description: 'لا يمكن العثور على الملف' })
  async getDownloadUrl(@Param('id') id: string) {
    return this.imagesService.getDownloadUrl(id);
  }

  @Patch(':id/watermark-toggle')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'تبديل حالة العلامة المائية' })
  @ApiOkResponse({ description: 'تم تبديل الحالة', type: ToggleWatermarkResponseDto })
  @ApiNotFoundResponse({ description: 'الصورة غير موجودة' })
  async toggleWatermark(@Param('id') id: string) {
    return this.imagesService.toggleWatermark(id);
  }
}
