import { Body, Controller, Get, Param, Post, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoopHistoryDetailQuery } from 'src/dto/history.detail.request.dto';
import { CoopResultQuery } from 'src/dto/history.detail.response.dto';

import { ResultsService } from './results.service';

@ApiTags('Results')
@Controller('results')
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @Post()
  @ApiOperation({
    deprecated: true,
    description: 'Create a result',
    operationId: 'CREATE_V1',
  })
  @Version('2')
  async createV1(@Body() request: CoopHistoryDetailQuery.Paginated): Promise<CoopResultQuery.Paginated> {
    return this.service.create(request);
  }

  @Post()
  @Version('1')
  @ApiOperation({ description: 'Create a result', operationId: 'CREATE_V2' })
  async createV2(@Body() request: CoopResultQuery.Paginated): Promise<CoopResultQuery.Paginated> {
    return this.service.create(request);
  }

  @Get()
  @ApiOperation({ description: 'Find results', operationId: 'FIND_ALL' })
  async find_all() {
    return await this.service.find_all();
  }

  @Get(':result_id')
  @ApiOperation({ description: 'Find a result', operationId: 'FIND' })
  async find(@Param('result_id') resultId: string) {
    return await this.service.find(resultId);
  }
}
