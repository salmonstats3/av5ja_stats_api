import { Controller, Get, HttpCode, HttpStatus, Version } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { VersionService } from './version.service';

@ApiTags('Version')
@Controller('version')
export class VersionController {
  constructor(private readonly service: VersionService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @Version('3')
  async version() {
    return this.service.getVersion();
  }
}
