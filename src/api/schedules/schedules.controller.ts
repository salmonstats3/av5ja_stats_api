import { Controller, Get, HttpCode, Version } from "@nestjs/common";
import { ApiBadRequestResponse, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger";

import { PaginatedDto } from "../dto/pagination.dto";
import { CoopScheduleDataResponse } from "../dto/schedules/schedule.response.dto";

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
    description: "指定されたスケジュールの統計データを返します.",
    operationId: "統計取得",
  })
  @ApiBadRequestResponse()
  find(): Promise<CoopScheduleDataResponse[]> {
    return this.service.get_schedules();
  }

  @Get("statistics")
  @Version("1")
  @HttpCode(200)
  @ApiTags("スケジュール")
  @ApiOperation({
    description: "指定されたスケジュールの統計データを返します.",
    operationId: "統計取得",
  })
  @ApiBadRequestResponse()
  estimate() {
    return this.service.get_schedule_statistics();
  }
}
