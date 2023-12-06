import { Body, Controller, Get, Post, Version } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'src/dto/response.dto';
import { StageScheduleQuery } from 'src/dto/schedule.dto';

import { SchedulesService } from './schedules.service';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Post()
  @ApiOperation({ description: 'Create schedules', operationId: 'CREATE', summary: 'Create schedules' })
  @ApiOkResponse({ isArray: true, type: CoopHistoryQuery.Schedule })
  async create(@Body() request: StageScheduleQuery.Request): Promise<CoopHistoryQuery.Schedules> {
    return this.service.create(request);
  }

  @Get()
  @Version('1')
  @ApiOperation({ deprecated: true, description: 'Find schedules', operationId: 'FIND', summary: 'Find schedules' })
  @ApiOkResponse({ isArray: true, type: CoopHistoryQuery.Schedule })
  async find(): Promise<CoopHistoryQuery.Schedule[]> {
    return this.service.find();
  }

  @Get()
  @Version('2')
  @ApiOperation({ deprecated: true, description: 'Find schedules', operationId: 'FIND_ALL', summary: 'Find schedules' })
  @ApiOkResponse({ isArray: true, type: CoopHistoryQuery.Schedule })
  async find_all(): Promise<CoopHistoryQuery.Schedule[]> {
    return this.service.find_all();
  }
}
