import { Controller, Get, HttpCode, Version } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { AppVersionResponse } from "../dto/authorize/app_version.dto";

import { AuthorizeService } from "./authorize.service";
import { AuthorizeResponse } from "./autorize.response.dto";

@Controller("authorize")
export class AuthorizeController {
  constructor(private readonly service: AuthorizeService) {}

  @Get("")
  @Version("1")
  @HttpCode(200)
  @ApiTags("スケジュール")
  @ApiOperation({
    description: "イカリング3のスケジュールを取得して書き込みます",
    operationId: "スケジュール書き込み",
  })
  @ApiBadRequestResponse()
  @ApiOkResponse({ type: AuthorizeResponse })
  async authorize(): Promise<AuthorizeResponse> {
    return this.service.authorize();
  }

  @Get("version")
  @Version("1")
  @HttpCode(200)
  @ApiTags("スケジュール")
  @ApiOperation({
    description: "イカリング3のスケジュールを取得して書き込みます",
    operationId: "スケジュール書き込み",
  })
  @ApiBadRequestResponse()
  @ApiOkResponse({ type: AppVersionResponse })
  async version(): Promise<AppVersionResponse> {
    return this.service.get_app_version();
  }
}
