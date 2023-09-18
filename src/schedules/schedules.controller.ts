import { Body, Controller, Post } from '@nestjs/common';

import { SchedulesService } from './schedules.service';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Post()
  async create(@Body() request: any) {
    console.log(request);
  }
}
