import { Body, Controller, Get, Headers, HttpCode, Post, Query, ValidationPipe, Version } from "@nestjs/common";
import { ApiBadRequestResponse, ApiExtraModels, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Result } from "@prisma/client";

import { PaginatedDto, PaginatedRequestDto } from "../dto/pagination.dto";
import { AppVersion, Client, CoopRequestHeader } from "../dto/results/result.headers.dto";
import { CoopResultManyRequest } from "../dto/results/result.request.dto";

import { CustomResult, ResultsService } from "./results.service";

@Controller("results")
@ApiExtraModels(PaginatedDto)
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @Get("")
  @HttpCode(200)
  @ApiTags("リザルト")
  @ApiOperation({
    deprecated: false,
    description: "新API",
    operationId: "リザルト登録V2(Salmonia3+)",
  })
  @ApiBadRequestResponse()
  fetch(@Query() request: PaginatedRequestDto): Promise<PaginatedDto<Result>> {
    return this.service.fetch(request);
  }

  @Post("")
  @Version("1")
  @HttpCode(201)
  @ApiTags("リザルト")
  @ApiOperation({
    deprecated: true,
    description: "Salmonia3+のリザルト登録",
    operationId: "登録(V1)",
  })
  @ApiBadRequestResponse()
  createManyV1(@Body() request: CoopResultManyRequest): Promise<CustomResult[]> {
    return this.service.upsertMany(request);
  }

  @Post("")
  @Version("2")
  @HttpCode(201)
  @ApiTags("リザルト")
  @ApiOperation({
    deprecated: true,
    description: "Salmonia3+のリザルト登録",
    operationId: "登録(V2)",
  })
  @ApiBadRequestResponse()
  createManyV2(@Body(new ValidationPipe({ transform: true })) request: CoopResultManyRequest): Promise<CustomResult[]> {
    return this.service.upsertMany(request);
  }

  @Post("")
  @Version("3")
  @HttpCode(201)
  @ApiTags("リザルト")
  @ApiOperation({
    description: "Salmonia3+のリザルト登録",
    operationId: "登録(V3)",
  })
  @ApiHeader({ description: "アプリバージョン", example: AppVersion.V216, name: "version", required: true })
  @ApiHeader({ description: "クライアント", example: Client.SALMONIA, name: "client", required: true })
  @ApiBadRequestResponse()
  @ApiOkResponse({ type: [Object] })
  createManyV3(@Body() body: CoopResultManyRequest, @Headers() headers: CoopRequestHeader): Promise<CustomResult[]> {
    return this.service.upsertMany(body, headers.version, headers.client);
  }

  @Post("restore")
  @Version("3")
  @HttpCode(201)
  @ApiTags("リザルト")
  @ApiOperation({
    description: "Salmonia3+のリザルト登録",
    operationId: "登録(V3)",
  })
  @ApiBadRequestResponse()
  @ApiOkResponse({ type: [Object] })
  restore(@Body() body: PaginatedDto<Result>): Promise<string> {
    return this.service.create(body);
  }
}
