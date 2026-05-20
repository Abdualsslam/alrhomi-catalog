import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FoldersService } from './folders.service';
import { CreateFolderDto, RenameFolderDto } from './dto/folder.dto';
import { FolderContentsResponseDto } from './dto/folder-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '.././common/decorators/roles.decorator';

@ApiTags('Folders')
@ApiBearerAuth('JWT-auth')
@Controller('folders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  @ApiOperation({ summary: 'إنشاء مجلد جديد' })
  @ApiCreatedResponse({ description: 'تم إنشاء المجلد بنجاح', schema: { type: 'object' } })
  async create(@Body() dto: CreateFolderDto) {
    return this.foldersService.create(dto);
  }

  @Get(':id/contents')
  @ApiOperation({ summary: 'جلب محتويات المجلد (المجلدات الفرعية والصور)' })
  @ApiParam({ name: 'id', description: 'معرف المجلد أو "root" للجذر' })
  @ApiOkResponse({ description: 'محتويات المجلد', type: FolderContentsResponseDto })
  async getContents(@Param('id') id: string) {
    const parentId = id === 'root' ? null : id;
    const contents = await this.foldersService.getContents(parentId);
    const breadcrumbs = await this.foldersService.getBreadcrumbs(parentId);
    return { ...contents, breadcrumbs };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'إعادة تسمية مجلد' })
  @ApiOkResponse({ description: 'تم التحديث بنجاح', schema: { type: 'object' } })
  async rename(@Param('id') id: string, @Body() dto: RenameFolderDto) {
    return this.foldersService.rename(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'حذف مجلد (يتم نقل المحتويات للجذر)' })
  @ApiNoContentResponse({ description: 'تم الحذف بنجاح' })
  async delete(@Param('id') id: string) {
    await this.foldersService.delete(id);
  }
}
