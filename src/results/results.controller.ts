import { Body, Controller, Get, Param, Post, UseGuards, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResultCreateManyRequest } from 'src/dto/paginated.dto';
import { ResultCreateRequest } from 'src/dto/result.dto';
import { UsersService } from 'src/users/users.service';

import { ResultsService } from './results.service';

@ApiTags('Results')
@Controller('results')
export class ResultsController {
  constructor(
    private readonly service: ResultsService,
    private readonly userService: UsersService,
  ) { }

  @Post()
  @ApiOperation({
    deprecated: true,
    description: 'Create a result without authentication',
    operationId: 'Create a result without authentication',
  })
  async createV1(@Body() request: ResultCreateManyRequest): Promise<Partial<Result>[]> {
    return this.service.createV1(request);
  }

  @Post()
  @Version('2')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Create a result with authentication', operationId: 'Create a result with authentication' })
  async createV2(@Body() request: ResultCreateRequest): Promise<Partial<Result>[]> {
    return this.service.createV2(request);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Find results', operationId: 'Find results' })
  async find_all() {
    return await this.service.find_all();
  }

  @Get(':result_id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Find a result', operationId: 'Find a result' })
  async find(@Param('result_id') result_id: string) {
    return await this.service.find(result_id);
  }
}
