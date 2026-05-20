import {
  Controller,
  Get,
  Post,
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
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AdminUsersService } from './admin-users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { MessageResponseDto } from '../../common/dto/message-response.dto';
import { AdminUserCreateResponseDto, AdminUserItemDto } from './dto/admin-user-response.dto';

@ApiTags('Admin - Users')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
@ApiForbiddenResponse({ description: 'Admin role required' })
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiOperation({ summary: 'جلب قائمة جميع المستخدمين' })
  @ApiOkResponse({ description: 'قائمة المستخدمين', type: [AdminUserItemDto] })
  async findAll() {
    return this.adminUsersService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'إنشاء مستخدم جديد' })
  @ApiCreatedResponse({ description: 'تم إنشاء المستخدم بنجاح', type: AdminUserCreateResponseDto })
  @ApiBadRequestResponse({ description: 'بيانات غير صحيحة' })
  @ApiConflictResponse({ description: 'المستخدم موجود مسبقاً' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.adminUsersService.create(createUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف مستخدم' })
  @ApiOkResponse({ description: 'تم حذف المستخدم بنجاح', type: MessageResponseDto })
  @ApiNotFoundResponse({ description: 'المستخدم غير موجود' })
  async remove(@Param('id') id: string) {
    return this.adminUsersService.remove(id);
  }
}
