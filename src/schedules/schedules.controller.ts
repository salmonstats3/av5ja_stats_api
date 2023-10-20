import { Body, Controller, Get, Param, Post, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Schedule } from '@prisma/client';
import { CoopHistoryQuery } from 'src/dto/history.dto';
import { StageScheduleQuery } from 'src/dto/schedule.dto';

import { ScheduleDto, SchedulesService } from './schedules.service';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly service: SchedulesService) { }

  @Post()
  @ApiOperation({ description: 'Create schedules', operationId: 'Create schedules' })
  async create(@Body() request: StageScheduleQuery.Request): Promise<CoopHistoryQuery.Schedule[]> {
    return this.service.create(request);
  }

  @Get()
  @ApiOperation({ deprecated: true, description: 'Find schedules', operationId: 'Find schedules V1' })
  async find_allV1(): Promise<Partial<Schedule>[]> {
    return this.service.find_allV1();
  }

  @Get()
  @Version('2')
  @ApiOperation({ description: 'Find schedules', operationId: 'Find schedules V2' })
  async find_allV2(): Promise<Partial<ScheduleDto>[]> {
    return this.service.find_allV2();
  }

  @Get(':schedule_id')
  @ApiOperation({ description: 'Find a schedule', operationId: 'Find a schedule' })
  async find(@Param('schedule_id') schedule_id: string) {
    return this.service.find(schedule_id);
  }
}
