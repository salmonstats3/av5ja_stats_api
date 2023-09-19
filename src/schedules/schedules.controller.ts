import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Schedule } from '@prisma/client';
import { ScheduleCreateDto } from 'src/dto/schedule.dto';

import { SchedulesService } from './schedules.service';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Post()
  @ApiOperation({ description: 'Create schedules', operationId: 'Create schedules' })
  async create(@Body() request: ScheduleCreateDto) {
    this.service.create(request);
  }

  @Get()
  @ApiOperation({ description: 'Find schedules', operationId: 'Find schedules' })
  async find_all(): Promise<Partial<Schedule>[]> {
    return this.service.find_all();
  }

  @Get(':schedule_id')
  @ApiOperation({ description: 'Find a schedule', operationId: 'Find a schedule' })
  async find(@Param('schedule_id') schedule_id: string) {
    console.log(schedule_id);
  }
}
