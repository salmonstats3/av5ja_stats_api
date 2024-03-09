import { Body, Controller, Post } from '@nestjs/common'
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { CoopHistoryQuery } from '@/dto/av5ja/coop_history.dto'
import { HistoriesService } from '@/histories/histories.service'

@ApiTags('Histories')
@Controller('histories')
export class HistoriesController {
  constructor(private readonly service: HistoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new history' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async create(@Body() request: CoopHistoryQuery.Request): Promise<CoopHistoryQuery.Response> {
    return this.service.create(request)
  }
}
