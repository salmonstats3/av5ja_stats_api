import { Controller, Get, Query, Version } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import { PaginatedDto } from "../dto/pagination.dto";
import { ScenarioCodeResponse, ScenarioCodeWhereInput } from "../dto/scenario.dto";

import { ScenarioCodesService } from "./scenario_codes.service";

@Controller("scenario_codes")
@ApiExtraModels(PaginatedDto)
export class ScenarioCodesController {
  constructor(private readonly service: ScenarioCodesService) {}

  @Get()
  @Version("1")
  @ApiTags("シナリオコード")
  @ApiOperation({
    description: "指定された条件を満たすシナリオコードを取得します",
    operationId: "取得",
  })
  @ApiNotFoundResponse()
  // @ApiQuery({ type: ScenarioCodeWhereInput })
  @ApiOkResponse({ type: ScenarioCodeResponse })
  find(
    @Query() request: ScenarioCodeWhereInput,
    // @Query(new ValidationPipe({ transform: true })) request: ScenarioCodeWhereInput,
  ): Promise<PaginatedDto<ScenarioCodeResponse>> {
    return this.service.findMany(request);
  }
}
