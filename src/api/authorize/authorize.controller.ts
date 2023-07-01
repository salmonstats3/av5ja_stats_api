import { Controller, Get, HttpCode } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AppVersionResult } from "../dto/authorize/app_version.dto";
import { AuthorizeService } from "./authorize.service";
import { AuthorizeResponse } from "./autorize.response.dto";

@Controller("authorize")
export class AuthorizeController {
  constructor(private readonly service: AuthorizeService) { }

  @Get("")
  @HttpCode(200)
  @ApiTags("認証")
  @ApiOperation({
    description: "認証情報を取得して返します",
    operationId: "取得",
  })
  @ApiBadRequestResponse()
  @ApiOkResponse({ type: AuthorizeResponse })
  async authorize(): Promise<AuthorizeResponse> {
    return this.service.authorize();
  }

  @Get("version")
  @HttpCode(200)
  @ApiTags("認証")
  @ApiOperation({
    description: "X-ProductVersionバージョンを取得して返します",
    operationId: "X-ProductVersion",
  })
  @ApiBadRequestResponse()
  @ApiOkResponse({ type: AppVersionResult })
  async version(): Promise<{ version: string; web_version: string }> {
    return this.service.get_version();
  }

  // @Get("bundle")
  // @HttpCode(200)
  // @ApiTags("認証")
  // @ApiOperation({
  //   description: "Bundle URLを返します",
  //   operationId: "URL取得",
  // })
  // @ApiBadRequestResponse()
  // @ApiOkResponse({ type: AppVersionResult })
  // async bundle(): Promise<string[]> {
  //   return this.service.get_bundle_urls();
  // }

  @Get("resources")
  @HttpCode(200)
  @ApiTags("認証")
  @ApiOperation({
    description: "Resources URLを返します",
    operationId: "リソースURL取得",
  })
  @ApiBadRequestResponse()
  @ApiOkResponse({ type: AppVersionResult })
  async resources(): Promise<any> {
    return this.service.get_resource_urls();
  }
}
