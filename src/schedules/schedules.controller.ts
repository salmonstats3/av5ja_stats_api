import { Body, Controller, Get, Param, Post, Version } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScheduleCreateDto } from 'src/dto/schedule.dto';

import { ScheduleDto, SchedulesService } from './schedules.service';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly service: SchedulesService) { }

  @Post()
  @ApiOkResponse({ isArray: true, type: ScheduleDto })
  @ApiOperation({ description: 'Create schedules', operationId: 'Create schedules' })
  async create(@Body() request: ScheduleCreateDto): Promise<ScheduleDto[]> {
    return this.service.create(request);
  }

  @Get()
  @ApiOkResponse({ isArray: true })
  @ApiOperation({ deprecated: true, description: 'Find schedules', operationId: 'Find schedules V1' })
  async find_allV1(): Promise<ScheduleDto[]> {
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
    console.log(schedule_id);
    return this.service.find(schedule_id);
  }
}
