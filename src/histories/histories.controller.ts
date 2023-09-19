import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HistoryCreateDto } from 'src/dto/history.dto';

import { HistoriesService } from './histories.service';

@ApiTags('Histories')
@Controller('histories')
export class HistoriesController {
  constructor(private readonly service: HistoriesService) {}

  @Post()
  @ApiOperation({ description: 'Create schedules', operationId: 'Create schedules' })
  async create(@Body() request: HistoryCreateDto): Promise<void> {
    this.service.create(request);
  }
}
