import { Body, Controller, Post } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { CoopHistoryQuery } from '@/dto/av5ja/coop_history.dto'
import { HistoriesService } from '@/histories/histories.service'

@ApiTags('Histories')
@Controller('histories')
export class HistoriesController {
  constructor(private readonly service: HistoriesService) {}

  @Post()
  @ApiBody({ type: CoopHistoryQuery.HistoryRequest })
  @ApiOperation({ summary: 'Create a new history' })
  @ApiOkResponse({ type: CoopHistoryQuery.HistoryResponse })
  @ApiBadRequestResponse()
  async create(@Body() request: CoopHistoryQuery.HistoryRequest): Promise<CoopHistoryQuery.HistoryResponse> {
    return this.service.create(request)
  }
}
