import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { HealthService, ReadinessResult } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('live')
  @Public()
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiResponse({
    status: 200,
    description: 'Service is alive',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
        },
      },
    },
  })
  liveness() {
    return { status: 'ok' };
  }

  @Get('ready')
  @Public()
  @ApiOperation({ summary: 'Readiness probe' })
  @ApiResponse({
    status: 200,
    description: 'Service is ready',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ready',
        },
        checks: {
          type: 'object',
          properties: {
            mongo: { type: 'string', example: 'up' },
            redis: { type: 'string', example: 'up' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Service is not ready',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'not_ready',
        },
        checks: {
          type: 'object',
          properties: {
            mongo: { type: 'string', example: 'up' },
            redis: { type: 'string', example: 'down' },
          },
        },
      },
    },
  })
  async readiness(): Promise<ReadinessResult> {
    const result = await this.healthService.getReadiness();

    if (result.status !== 'ready') {
      throw new ServiceUnavailableException(result);
    }

    return result;
  }
}
