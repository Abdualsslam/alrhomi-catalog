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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FoldersService } from './folders.service';
import { CreateFolderDto, RenameFolderDto } from './dto/folder.dto';

@ApiTags('Folders')
@Controller('folders')
export class FoldersController {
    constructor(private readonly foldersService: FoldersService) { }

    @Post()
    @ApiOperation({ summary: 'إنشاء مجلد جديد' })
    @ApiResponse({ status: 201, description: 'تم إنشاء المجلد بنجاح' })
    async create(@Body() dto: CreateFolderDto) {
        return this.foldersService.create(dto);
    }

    @Get(':id/contents')
    @ApiOperation({ summary: 'جلب محتويات المجلد (المجلدات الفرعية والصور)' })
    @ApiParam({ name: 'id', description: 'معرف المجلد أو "root" للجذر' })
    @ApiResponse({ status: 200, description: 'محتويات المجلد' })
    async getContents(@Param('id') id: string) {
        const parentId = id === 'root' ? null : id;
        const contents = await this.foldersService.getContents(parentId);
        const breadcrumbs = await this.foldersService.getBreadcrumbs(parentId);
        return { ...contents, breadcrumbs };
    }

    @Patch(':id')
    @ApiOperation({ summary: 'إعادة تسمية مجلد' })
    @ApiResponse({ status: 200, description: 'تم التحديث بنجاح' })
    async rename(@Param('id') id: string, @Body() dto: RenameFolderDto) {
        return this.foldersService.rename(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'حذف مجلد (يتم نقل المحتويات للجذر)' })
    @ApiResponse({ status: 204, description: 'تم الحذف بنجاح' })
    async delete(@Param('id') id: string) {
        await this.foldersService.delete(id);
    }
}
