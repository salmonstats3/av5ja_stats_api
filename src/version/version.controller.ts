import { Controller, Get, HttpCode, HttpStatus, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { VersionService } from './version.service';

@ApiTags('Version')
@Controller('')
export class VersionController {
  constructor(private readonly service: VersionService) { }

  @Get('authorize/version')
  @HttpCode(HttpStatus.OK)
  @Version('3')
  @ApiOperation({ deprecated: true, operationId: 'GET_VERSION', summary: 'Get version' })
  async version_v1() {
    return this.service.getVersion();
  }

  @Get('version')
  @HttpCode(HttpStatus.OK)
  @Version('1')
  @ApiOperation({ operationId: 'GET_VERSION', summary: 'Get version' })
  async version_v2() {
    return this.service.getVersion();
  }
}
