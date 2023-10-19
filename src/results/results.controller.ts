import { Body, Controller, Get, Param, Post, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoopHistoryDetailQuery } from 'src/dto/history.detail.request.dto';
import { CoopResultQuery } from 'src/dto/history.detail.response.dto';

import { ResultsService } from './results.service';

@ApiTags('Results')
@Controller('results')
export class ResultsController {
  constructor(private readonly service: ResultsService) { }

  @Post()
  @ApiOperation({
    deprecated: true,
    description: 'Create a result without authentication',
    operationId: 'Create a result V1',
  })
  async createV1(@Body() request: CoopHistoryDetailQuery.Paginated): Promise<CoopResultQuery.Paginated> {
    return this.service.create(request);
  }

  @Post()
  @Version('2')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Create a result with authentication', operationId: 'Create a result V2' })
  async createV2(@Body() request: CoopResultQuery.Paginated): Promise<CoopResultQuery.Paginated> {
    return this.service.create(request);
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
