import { Body, Controller, HttpCode, Post, ValidationPipe, Version } from "@nestjs/common";
import { ApiBadRequestResponse, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Result } from "@prisma/client";

import { PaginatedDto } from "../dto/pagination.dto";
import { CoopResultCustomRequest } from "../dto/results/result.custom.dto";

import { ResultsService } from "./results.service";

@Controller("results")
@ApiExtraModels(PaginatedDto)
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  // @Get("")
  // @Version("1")
  // @HttpCode(201)
  // @ApiTags("リザルト")
  // @ApiOperation({
  //   deprecated: true,
  //   description: "旧API",
  //   operationId: "リザルト登録V2(Salmonia3+)",
  // })
  // @ApiBadRequestResponse()
  // fetch(@Query(new ValidationPipe({ transform: true })) request: PaginatedRequestDto): Promise<PaginatedDto<Result>> {
  //   return this.service.fetch(request);
  // }

  // @Post("")
  // @Version("1")
  // @HttpCode(201)
  // @ApiTags("リザルト")
  // @ApiOperation({
  //   deprecated: true,
  //   description: "旧API",
  //   operationId: "リザルト登録V2(Salmonia3+)",
  // })
  // @ApiBadRequestResponse()
  // upsertManyV1(@Body() request: CoopResultManyRequest): Promise<Result[]> {
  //   return this.service.upsertMany(request);
  // }

  // @Post("")
  // @Version("2")
  // @HttpCode(201)
  // @ApiTags("リザルト")
  // @ApiOperation({
  //   deprecated: false,
  //   description: "新API",
  //   operationId: "リザルト登録V2(Salmonia3+)",
  // })
  // @ApiBadRequestResponse()
  // upsertManyV2(@Body() request: CoopResultManyRequest): Promise<Result[]> {
  //   return this.service.upsertMany(request);
  // }

  @Post("")
  @Version("3")
  @HttpCode(201)
  @ApiTags("リザルト")
  @ApiOperation({
    deprecated: false,
    description: "新API",
    operationId: "リザルト登録V2(Salmonia3+)",
  })
  @ApiBadRequestResponse()
  restore(@Body(new ValidationPipe({ transform: true })) request: PaginatedDto<CoopResultCustomRequest>): Promise<Result[]> {
    return this.service.restore(request);
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
