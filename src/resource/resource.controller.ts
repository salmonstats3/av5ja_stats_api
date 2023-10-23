import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Resource } from 'src/dto/resource.dto';

import { ResourceService } from './resource.service';

@ApiTags('Resource')
@Controller('resource')
export class ResourceController {
  constructor(private readonly service: ResourceService) { }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get resource', operationId: 'GET_RESOURCE', summary: 'Get resource' })
  @ApiOkResponse({ type: Resource })
  async resource() {
    return this.service.getResource();
  }
}
