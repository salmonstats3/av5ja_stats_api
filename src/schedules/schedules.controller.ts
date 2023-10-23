import { Body, Controller, Get, Param, Post, Version } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoopHistoryQuery } from 'src/dto/history.dto';
import { StageScheduleQuery } from 'src/dto/schedule.dto';

import { ScheduleDto, SchedulesService } from './schedules.service';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Post()
  @ApiOperation({ description: 'Create schedules', operationId: 'CREATE', summary: 'Create schedules' })
  async create(@Body() request: StageScheduleQuery.Request): Promise<CoopHistoryQuery.Schedule[]> {
    return this.service.create(request);
  }

  @Get()
  @ApiOperation({ deprecated: true, description: 'Find schedules', operationId: 'FIND_ALL_V1', summary: 'Find schedules' })
  @ApiOkResponse({ isArray: true, type: ScheduleDto })
  async find_allV1(): Promise<Partial<ScheduleDto>[]> {
    return this.service.find_all_v1();
  }

  @Get()
  @Version('2')
  @ApiOperation({ description: 'Find schedules', operationId: 'FIND_ALL_V2', summary: 'Find schedules' })
  @ApiOkResponse({ isArray: true, type: ScheduleDto })
  async find_allV2(): Promise<Partial<ScheduleDto>[]> {
    return this.service.find_all_v2();
  }

  @Get(':schedule_id')
  @ApiOperation({ description: 'Find a schedule', operationId: 'FIND', summary: 'Find a schedule' })
  async find(@Param('schedule_id') scheduleId: string) {
    return this.service.find(scheduleId);
  }
}
