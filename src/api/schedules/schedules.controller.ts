import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  ValidationPipe,
  Version,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedDto } from '../dto/pagination.dto';
import { CustomCoopScheduleResponse } from '../dto/schedules/schedule.dto';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
@ApiExtraModels(PaginatedDto)
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Get('')
  @ApiTags('スケジュール')
  @ApiOperation({
    operationId: '取得',
    description: 'スケジュールを一括で取得します',
  })
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: [CustomCoopScheduleResponse] })
  find(): Promise<CustomCoopScheduleResponse[]> {
    return this.service.findAll();
  }
}
