import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ResourceService } from './resource.service';

@ApiTags('Resource')
@Controller('resource')
export class ResourceController {
  constructor(private readonly service: ResourceService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async resource() {
    return this.service.getResource();
  }
}
