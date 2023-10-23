import { Controller, Get, HttpCode, HttpStatus, Version } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Version as APIVersion } from 'src/dto/version.dto';

import { VersionService } from './version.service';

@ApiTags('Version')
@Controller('')
export class VersionController {
  constructor(private readonly service: VersionService) { }

  @Get('authorize/version')
  @HttpCode(HttpStatus.OK)
  @Version('3')
  @ApiOkResponse({ type: APIVersion })
  @ApiOperation({ deprecated: true, operationId: 'GET_VERSION_V3', summary: 'Get version' })
  async version_v1() {
    return this.service.getVersion();
  }

  @Get('version')
  @HttpCode(HttpStatus.OK)
  @Version('1')
  @ApiOperation({ operationId: 'GET_VERSION_V1', summary: 'Get version' })
  @ApiOkResponse({ type: APIVersion })
  async version_v2() {
    return this.service.getVersion();
  }
}
