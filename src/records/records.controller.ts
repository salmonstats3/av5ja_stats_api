import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CoopRecordQuery } from 'src/dto/record.dto';
import { RecordsService } from './records.service';
import { plainToInstance } from 'class-transformer';

@Controller('records')
export class RecordsController {
  constructor(private readonly service: RecordsService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Post records', operationId: 'POST_RECORD', summary: 'Post records' })
  @ApiOkResponse({ type: CoopRecordQuery.Response })
  async record(@Body() request: CoopRecordQuery.Request): Promise<CoopRecordQuery.Response> {
    console.log(request)
    return request.record;
    // return plainToInstance(CoopRecordQuery.Request, request, { excludeExtraneousValues: true })
  }
}
