import { CacheInterceptor } from "@nestjs/cache-manager"
import { Controller, Get, HttpCode, HttpStatus, UseInterceptors, Version } from "@nestjs/common"
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger"

import { Version as APIVersion, VersionV3 as APIVersionV3 } from "@/dto/version.dto"
import { VersionService } from "@/version/version.service"

@ApiTags("Version")
@Controller()
@UseInterceptors(CacheInterceptor)
export class VersionController {
  constructor(private readonly service: VersionService) {}

  @Get("authorize/version")
  @HttpCode(HttpStatus.OK)
  @Version("3")
  @ApiOkResponse({ type: APIVersion })
  @ApiOperation({
    deprecated: true,
    summary: "Get Nintendo Switch Online app version and revision."
  })
  async index(): Promise<APIVersion> {
    return this.service.index()
  }

  @Get("version")
  @HttpCode(HttpStatus.OK)
  @Version("1")
  @ApiOkResponse({ type: APIVersionV3 })
  @ApiOperation({
    summary: "Get Nintendo Switch Online app version and revision."
  })
  async versionV3(): Promise<APIVersionV3> {
    return this.service.indexV3()
  }
}
