import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  ValidationPipe,
  Version,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";

import { ApiOkResponsePaginated, PaginatedDto } from "../dto/pagination.dto";
import { CoopResultFindManyArgsPaginatedRequest } from "../dto/request.dto";
import { CoopResultCreateResponse, CoopResultResponse } from "../dto/response.dto";
import { CustomResultRequest, ResultRequest } from "../dto/splatnet3/results.dto";

import { ResultsService } from "./results.service";
import { CoopResultsCreateResponse } from "./results.status";

@Controller("results")
@ApiExtraModels(PaginatedDto)
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @Get(":salmon_id")
  @ApiParam({ description: "リザルトID", name: "salmon_id", type: "integer" })
  @ApiTags("リザルト")
  @ApiOperation({
    description:
      "内部IDを指定してリザルトを一件取得します。存在しない場合は404エラーを返します。オオモノシャケ、イベント、潮位、バッジ、ネームプレート、ユニフォーム、スペシャル、ブキ、ステージ等のEnumの対応する値については https://github.com/tkgstrator/SplatNet3/tree/v2.x/Sources/SplatNet3/Enum/Ids をご参照ください。",
    operationId: "取得",
  })
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: CoopResultResponse })
  find(@Param("salmon_id", ParseIntPipe) salmonId: number): Promise<CoopResultResponse> {
    return this.service.find(salmonId);
  }

  @Get("")
  @ApiTags("リザルト")
  @ApiOperation({ operationId: "一括取得" })
  @ApiOkResponsePaginated({ type: CoopResultResponse })
  @ApiNotFoundResponse()
  findMany(
    @Query(new ValidationPipe({ transform: true }))
    request: CoopResultFindManyArgsPaginatedRequest,
  ): Promise<PaginatedDto<CoopResultResponse>> {
    return this.service.findMany(request);
  }

  @Post("")
  @Version("1")
  @HttpCode(201)
  @ApiTags("リザルト")
  @ApiOperation({
    description:
      "イカリング3のデータを最大同時に50件まで登録します。`results`のキーを指定して、JSONデータを配列で送信してください。",
    operationId: "登録(SplatNet3)",
  })
  @ApiCreatedResponse({ type: CoopResultsCreateResponse })
  @ApiBadRequestResponse()
  createMany(@Body() request: ResultRequest): Promise<CoopResultCreateResponse[]> {
    return this.service.upsertManyV1(request);
  }

  @Post("")
  @Version("2")
  @HttpCode(201)
  @ApiTags("リザルト")
  @ApiOperation({
    description:
      "Salmonia3+形式のデータを最大同時に50件まで登録します。`results`のキーを指定して、JSONデータを配列で送信してください。",
    operationId: "登録(Salmonia3+)",
  })
  @ApiCreatedResponse({ type: CoopResultsCreateResponse })
  @ApiBadRequestResponse()
  upsertMany(@Body() request: CustomResultRequest): Promise<CoopResultCreateResponse[]> {
    return this.service.upsertManyV2(request);
  }
}
