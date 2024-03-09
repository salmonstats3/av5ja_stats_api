import { CacheInterceptor } from '@nestjs/cache-manager'
import { Controller, Get, HttpCode, HttpStatus, UseInterceptors, Version } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { Resource } from '@/dto/resource.dto'
import { ResourcesService } from '@/resources/resources.service'

@ApiTags('Resources')
@Controller('resources')
@UseInterceptors(CacheInterceptor)
export class ResourcesController {
  constructor(private readonly service: ResourcesService) {}

  @Get('')
  @Version('3')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Get resource',
    operationId: 'GET_RESOURCE',
    summary: 'Get resource',
  })
  @ApiOkResponse({ type: Resource })
  async index() {
    return this.service.index()
  }
}
