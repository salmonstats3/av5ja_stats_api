import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoopHistoryQuery } from 'src/dto/history.dto';

import { HistoriesService } from './histories.service';
import { Response } from 'src/dto/response.dto';

@ApiTags('Histories')
@Controller('histories')
export class HistoriesController {
  constructor(private readonly service: HistoriesService) {}

  @Post()
  @ApiOperation({ description: 'Create schedules', operationId: 'Create schedules' })
  @ApiOkResponse({ type: Response.CoopHistoryQuery })
  async create(@Body() request: CoopHistoryQuery.Request): Promise<Response.CoopHistoryQuery> {
    return this.service.create(request);
  }
}
