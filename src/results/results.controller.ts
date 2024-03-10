import { Body, Controller, Post, UseFilters, Version } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { ResultsFilter } from './results.filter'

import { CoopHistoryDetailQuery as R3 } from '@/dto/av5ja/coop_history_detail.dto'
import { CoopHistoryDetailQuery as R2 } from '@/dto/request/result.v2.dto'
import { ResultsService } from '@/results/results.service'

@ApiTags('Results')
@Controller('results')
@UseFilters(ResultsFilter)
export class ResultsController {
  constructor(readonly service: ResultsService) { }

  @Post()
  @Version('2')
  @ApiBody({ type: R2.V2.Paginated })
  @ApiOkResponse({ type: R2.V2.Paginated })
  @ApiBadRequestResponse()
  @ApiOperation({ deprecated: true, summary: 'Create a new result.' })
  create_v2(
    @Body()
    request: R2.V2.Paginated,
  ) {
    return this.service.create_v2(request)
  }

  @Post()
  @Version('3')
  @ApiBody({ type: R3.V3.DetailedRequest })
  @ApiOkResponse({ type: R2.V2.Paginated })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiOperation({ summary: 'Create a new result.' })
  create_v3(@Body() request: R3.V3.DetailedRequest) {
    return this.service.create_v3(request)
  }
}
