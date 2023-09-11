import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from '@prisma/client';

import { PaginatedDto, PaginatedRequestDto } from '../dto/pagination.dto';

import { ScenarioService } from './scenario.service';

@Controller('scenario')
export class ScenarioController {
  constructor(private readonly service: ScenarioService) {}

  @Get('')
  @ApiTags('シナリオコード')
  @ApiOperation({ description: 'シナリオコードを取得します', operationId: 'シナリオコード取得' })
  getAnalytics(@Query() request: PaginatedRequestDto): Promise<PaginatedDto<Partial<Result>>> {
    return this.service.getScenario(request);
  }
}
