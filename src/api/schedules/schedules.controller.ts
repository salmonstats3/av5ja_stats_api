import { Controller, Get, HttpCode, Query, ValidationPipe, Version } from "@nestjs/common";
import { ApiBadRequestResponse, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger";

import { PaginatedDto } from "../dto/pagination.dto";
import { CoopScheduleDataResponse } from "../dto/schedules/schedule.response.dto";

import { ScheduleRequestQuery } from "./schedules.request.dto";
import { SchedulesService } from "./schedules.service";

@Controller("schedules")
@ApiExtraModels(PaginatedDto)
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Get("")
  @Version("1")
  @HttpCode(200)
  @ApiTags("スケジュール")
  @ApiOperation({
    description: "スケジュールを返します",
    operationId: "スケジュール取得",
  })
  @ApiBadRequestResponse()
  findManyV1(): Promise<CoopScheduleDataResponse[]> {
    return this.service.get_schedules();
  }

  @Get("")
  @Version("2")
  @HttpCode(200)
  @ApiTags("スケジュール")
  @ApiOperation({
    description: "スケジュールを返します",
    operationId: "スケジュール取得",
  })
  @ApiBadRequestResponse()
  findManyV2(@Query(new ValidationPipe({ transform: true })) query: ScheduleRequestQuery): Promise<CoopScheduleDataResponse[]> {
    // return this.service.update_schedules();
    return this.service.get_schedules(query);
  }

  @Get("statistics")
  @Version("1")
  @HttpCode(200)
  @ApiTags("スケジュール")
  @ApiOperation({
    description: "最新のスケジュールの統計データを返します.",
    operationId: "スケジュール統計取得",
  })
  @ApiBadRequestResponse()
  estimate() {
    return this.service.get_schedule_statistics();
  }
}
