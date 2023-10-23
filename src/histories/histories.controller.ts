import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoopHistoryQuery } from 'src/dto/history.dto';

import { HistoriesService } from './histories.service';

@ApiTags('Histories')
@Controller('histories')
export class HistoriesController {
  constructor(private readonly service: HistoriesService) {}

  @Post()
  @ApiOperation({ description: 'Create schedules', operationId: 'Create schedules' })
  @ApiOkResponse({ type: CoopHistoryQuery.Response })
  async create(@Body() request: CoopHistoryQuery.Request): Promise<CoopHistoryQuery.Response> {
    return this.service.create(request);
  }
}
