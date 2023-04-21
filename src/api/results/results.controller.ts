import { Body, Controller, HttpCode, Post, Version } from "@nestjs/common";
import { ApiBadRequestResponse, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Result } from "@prisma/client";

import { PaginatedDto } from "../dto/pagination.dto";
import { CoopResultManyRequest } from "../dto/results/results.request.dto";

import { ResultsService } from "./results.service";

@Controller("results")
@ApiExtraModels(PaginatedDto)
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @Post("")
  @Version("1")
  @HttpCode(201)
  @ApiTags("リザルト")
  @ApiOperation({
    deprecated: true,
    description: "旧API",
    operationId: "リザルト登録V2(Salmonia3+)",
  })
  @ApiBadRequestResponse()
  upsertManyV1(@Body() request: CoopResultManyRequest): Promise<Result[]> {
    return this.service.upsertMany(request);
  }

  @Post("")
  @Version("2")
  @HttpCode(201)
  @ApiTags("リザルト")
  @ApiOperation({
    deprecated: false,
    description: "新API",
    operationId: "リザルト登録V2(Salmonia3+)",
  })
  @ApiBadRequestResponse()
  upsertManyV2(@Body() request: CoopResultManyRequest): Promise<Result[]> {
    return this.service.upsertMany(request);
  }

  // @Post("")
  // @Version("1")
  // @HttpCode(201)
  // @ApiTags("リザルト")
  // @ApiOperation({
  //   description:
  //     "Salmonia3+形式のデータを最大同時に200件まで登録します。`results`のキーを指定して、JSONデータを配列で送信してください。",
  //   operationId: "登録(SplatNet3)",
  // })
  // @ApiBadRequestResponse()
  // createMany(@Body() request: CustomCoopResultManyRequest): Promise<Result[]> {
  //   return this.service.createMany(request);
  // }
}
