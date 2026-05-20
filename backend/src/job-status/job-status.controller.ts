import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JobStatusService } from './job-status.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { JobStatusResponseDto, JobStatusSimpleResponseDto } from './dto/job-status-response.dto';

@ApiTags('Job Status')
@Controller()
export class JobStatusController {
  constructor(private readonly jobStatusService: JobStatusService) {}

  @Get('jobs/:jobId/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  @ApiOperation({ summary: 'جلب حالة المهمة' })
  @ApiParam({ name: 'jobId', description: 'معرف المهمة' })
  @ApiOkResponse({ description: 'حالة المهمة', type: JobStatusResponseDto })
  @ApiNotFoundResponse({ description: 'المهمة غير موجودة' })
  async getJobStatus(@Param('jobId') jobId: string) {
    return this.jobStatusService.getJobStatus(jobId);
  }

  @Get('job-status/:jobId')
  @Public()
  @ApiOperation({ summary: 'جلب حالة المهمة (عام)' })
  @ApiParam({ name: 'jobId', description: 'معرف المهمة' })
  @ApiOkResponse({ description: 'حالة المهمة المبسطة', type: JobStatusSimpleResponseDto })
  @ApiNotFoundResponse({ description: 'المهمة غير موجودة' })
  async getJobStatusSimple(@Param('jobId') jobId: string) {
    return this.jobStatusService.getJobStatusSimple(jobId);
  }
}
