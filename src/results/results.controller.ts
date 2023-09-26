import { Body, Controller, Get, Param, Post, Request, UseGuards, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResultCreateRequest } from 'src/dto/result.dto';
import { UsersService } from 'src/users/users.service';

import { ResultsService } from './results.service';

@ApiTags('Results')
@Controller('results')
export class ResultsController {
  constructor(
    private readonly service: ResultsService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Create a result', operationId: 'Create a result' })
  async createV1(@Body() request: ResultCreateRequest, @Request() req: any): Promise<Partial<Result>[]> {
    // NplnUserIdをアカウントに追加する
    this.userService.set(request.nplnUserId, req.user.userId);
    return await this.service.createV1(request);
  }

  @Post()
  @Version('2')
  @ApiOperation({ description: 'Create a result(v2)', operationId: 'Create a result' })
  async createV2(@Body() request: ResultCreateRequest): Promise<ResultCreateRequest> {
    return await this.service.createV2(request);
  }

  @Get()
  @ApiOperation({ description: 'Find results', operationId: 'Find results' })
  async find_all() {
    return await this.service.find_all();
  }

  @Get(':result_id')
  @ApiOperation({ description: 'Find a result', operationId: 'Find a result' })
  async find(@Param('result_id') result_id: string) {
    return await this.service.find(result_id);
  }
}
