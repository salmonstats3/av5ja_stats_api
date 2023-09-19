import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResultCreateDto } from 'src/dto/result.dto';

import { ResultsService } from './results.service';

@ApiTags('Results')
@Controller('results')
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @Post()
  @ApiOperation({ description: 'Create results', operationId: 'Create results' })
  async create(@Body() request: ResultCreateDto) {
    console.log(JSON.stringify(request, null, 2));
  }

  @Get()
  @ApiOperation({ description: 'Find results', operationId: 'Find results' })
  async find_all() {
    console.log();
  }

  @Get(':result_id')
  @ApiOperation({ description: 'Find a result', operationId: 'Find a result' })
  async find(@Param('result_id') result_id: string) {
    console.log(result_id);
  }
}
