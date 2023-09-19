import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from '@prisma/client';
import { ResultCreateRequest } from 'src/dto/result.dto';

import { ResultsService } from './results.service';

@ApiTags('Results')
@Controller('results')
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @Post()
  @ApiOperation({ description: 'Create a result', operationId: 'Create a result' })
  async create(@Body() request: ResultCreateRequest): Promise<Partial<Result>[]> {
    return await this.service.create(request);
  }

  @Get()
  @ApiOperation({ description: 'Find results', operationId: 'Find results' })
  async find_all() {
    return await this.service.find_all();
  }

  @Get(':result_id')
  @ApiOperation({ description: 'Find a result', operationId: 'Find a result' })
  async find(@Param('result_id') result_id: string) {
    return await this.service.find(result_id);
  }
}
