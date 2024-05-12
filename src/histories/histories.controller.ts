import { Body, Controller, Patch, Post } from "@nestjs/common"
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger"

import { CoopHistoryQuery } from "@/dto/av5ja/coop_history.dto"
import { CoopHistoryDetailQuery as R2 } from "@/dto/request/result.v2.dto"
import { HistoriesService } from "@/histories/histories.service"

@ApiTags("Histories")
@Controller("histories")
export class HistoriesController {
  constructor(private readonly service: HistoriesService) {}

  @Post()
  @ApiBody({ type: CoopHistoryQuery.HistoryRequest })
  @ApiOperation({ summary: "Create a new history" })
  @ApiOkResponse({ type: CoopHistoryQuery.HistoryResponse })
  @ApiBadRequestResponse()
  async create(@Body() request: CoopHistoryQuery.HistoryRequest): Promise<CoopHistoryQuery.HistoryResponse> {
    return this.service.create(request)
  }

  @Patch()
  @ApiBody({ type: CoopHistoryQuery.HistoryUpdateRequest })
  @ApiOperation({ summary: "Update histories" })
  @ApiOkResponse({ type: CoopHistoryQuery.HistoryResponse })
  @ApiBadRequestResponse()
  async update(@Body() request: CoopHistoryQuery.HistoryUpdateRequest): Promise<R2.V2.Paginated> {
    return this.service.update(request)
  }
}
