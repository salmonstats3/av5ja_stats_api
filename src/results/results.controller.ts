import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ResultsService } from './results.service';

@ApiTags('Results')
@Controller('results')
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @Post()
  async create(@Body() request: any) {
    console.log(request);
  }

  @Get()
  async find_all() {
    console.log();
  }

  @Get(':result_id')
  async find(@Param('result_id') result_id: string) {
    console.log(result_id);
  }
}
