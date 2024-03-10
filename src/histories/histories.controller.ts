import { Body, Controller, Post } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { CoopHistoryQuery } from '@/dto/av5ja/coop_history.dto'
import { HistoriesService } from '@/histories/histories.service'

@ApiTags('Histories')
@Controller('histories')
export class HistoriesController {
  constructor(private readonly service: HistoriesService) {}

  @Post()
  @ApiBody({ type: CoopHistoryQuery.Request })
  @ApiOperation({ summary: 'Create a new history' })
  @ApiOkResponse({ type: CoopHistoryQuery.Response })
  @ApiBadRequestResponse()
  async create(@Body() request: CoopHistoryQuery.Request): Promise<CoopHistoryQuery.Response> {
    return this.service.create(request)
  }
}
