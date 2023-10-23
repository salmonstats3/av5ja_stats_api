import { Body, Controller, Get, Param, Post, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from '@prisma/client';
import { CoopHistoryDetailQuery } from 'src/dto/history.detail.request.dto';
import { CoopResultQuery } from 'src/dto/history.detail.response.dto';

import { ResultsService } from './results.service';

@ApiTags('Results')
@Controller('results')
export class ResultsController {
  constructor(private readonly service: ResultsService) { }

  @Post()
  @Version('1')
  @ApiOperation({ description: 'Create a result', operationId: 'CREATE_V1', summary: 'Create a result' })
  @ApiOkResponse({ type: CoopResultQuery.Paginated })
  async createV2(@Body() request: CoopResultQuery.Paginated): Promise<CoopResultQuery.Paginated> {
    return this.service.create(request);
  }

  @Post()
  @Version('2')
  @ApiOperation({
    deprecated: true,
    description: 'Create a result',
    operationId: 'CREATE_V2',
    summary: 'Create a result',
  })
  @ApiOkResponse({ type: CoopResultQuery.Paginated })
  async createV1(@Body() request: CoopHistoryDetailQuery.Paginated): Promise<CoopResultQuery.Paginated> {
    return this.service.create(request);
  }

  @Get()
  @ApiOperation({ description: 'Find results', operationId: 'FIND_ALL', summary: 'Find results' })
  @ApiBearerAuth()
  async find_all(): Promise<Partial<Result>[]> {
    return [];
    // return await this.service.find_all();
  }

  @Get(':result_id')
  @ApiOperation({ description: 'Find a result', operationId: 'FIND', summary: 'Find a result' })
  @ApiBearerAuth()
  async find(@Param('result_id') resultId: string) {
    return await this.service.find(resultId);
  }
}
