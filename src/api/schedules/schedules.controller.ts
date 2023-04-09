import { Controller, Get, HttpCode, Version } from "@nestjs/common";
import { ApiBadRequestResponse, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger";

import { PaginatedDto } from "../dto/pagination.dto";
import { CoopScheduleResponse } from "../dto/schedules/schedule.response.dto";
import { CoopScheduleStatsResponse } from "../dto/schedules/schedule.stats.response.dto";

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
  find(): Promise<CoopScheduleResponse[]> {
    return this.service.find();
  }

  @Get("latest")
  @Version("2")
  @HttpCode(200)
  @ApiTags("スケジュール")
  @ApiOperation({
    description: "指定されたスケジュールの統計データを取得します.",
    operationId: "統計取得",
  })
  @ApiBadRequestResponse()
  findMany3(): Promise<CoopScheduleStatsResponse> {
    return this.service.findManyByDangerRate();
  }
}
