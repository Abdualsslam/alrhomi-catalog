import { Controller, Get, Delete, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AdminImagesService } from './admin-images.service';
import { AdminImageQueryDto } from './dto/admin-image-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { MessageResponseDto } from '../../common/dto/message-response.dto';
import { AdminImageListResponseDto } from './dto/admin-image-response.dto';

@ApiTags('Admin - Images')
@Controller('admin/images')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
@ApiForbiddenResponse({ description: 'Admin role required' })
export class AdminImagesController {
  constructor(private readonly adminImagesService: AdminImagesService) {}

  @Get()
  @ApiOperation({ summary: 'جلب قائمة جميع الصور' })
  @ApiOkResponse({ description: 'قائمة الصور مع حالة المعالجة', type: AdminImageListResponseDto })
  async findAll(@Query() queryDto: AdminImageQueryDto) {
    return this.adminImagesService.findAll(queryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف صورة' })
  @ApiOkResponse({ description: 'تم حذف الصورة بنجاح', type: MessageResponseDto })
  @ApiNotFoundResponse({ description: 'الصورة غير موجودة' })
  async remove(@Param('id') id: string) {
    return this.adminImagesService.remove(id);
  }
}
