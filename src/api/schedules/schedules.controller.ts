import { Controller, Get, HttpCode, Version } from "@nestjs/common";
import { ApiBadRequestResponse, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger";

import { PaginatedDto } from "../dto/pagination.dto";
import { CoopScheduleResponse } from "../dto/schedules/schedule.response.dto";
import { CoopScheduleStats } from "../dto/schedules/schedule.stats.response.dto";

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
  @ApiTags("最新スケジュール統計")
  @ApiOperation({
    description: "指定されたスケジュールの統計データ詳細を返します.",
    operationId: "統計詳細取得",
  })
  @ApiBadRequestResponse()
  findMany3(): Promise<CoopScheduleStats[]> {
    return this.service.findManyByDangerRate();
  }
}
