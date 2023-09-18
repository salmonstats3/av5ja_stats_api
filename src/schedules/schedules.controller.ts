import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SchedulesService } from './schedules.service';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Post()
  async create(@Body() request: any) {
    console.log(request);
  }

  @Get()
  async find_all() {
    console.log();
  }

  @Get(':schedule_id')
  async find(@Param('schedule_id') schedule_id: string) {
    console.log(schedule_id);
  }
}
