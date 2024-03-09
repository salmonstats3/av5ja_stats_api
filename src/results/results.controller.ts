import { Body, Controller, Post, Version } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { CoopHistoryDetailQuery as R3 } from '@/dto/av5ja/coop_history_detail.dto'
import { CoopHistoryDetailQuery as R2 } from '@/dto/request/result.v2.dto'
import { ResultsService } from '@/results/results.service'

@ApiTags('Results')
@Controller('results')
// @UseInterceptors(ResultsInterceptor)
// @UseFilters(ResultsFilter)
export class ResultsController {
  constructor(readonly service: ResultsService) {}

  @Post()
  @Version('2')
  @ApiBody({ type: R2.V2.Paginated })
  @ApiOkResponse()
  @ApiNotFoundResponse()
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
  @ApiBody({ type: R3.V3.Request })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiOperation({ summary: 'Create a new result.' })
  create_v3(@Body() request: R3.V3.Request) {
    return this.service.create_v3(request)
  }
}
