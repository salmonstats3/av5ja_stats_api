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
  @ApiOkResponse({ type: CoopHistoryQuery.Response.Response })
  async create(@Body() request: CoopHistoryQuery.Request.Request): Promise<CoopHistoryQuery.Response.Response[]> {
    return this.service.create(request);
  }
}
