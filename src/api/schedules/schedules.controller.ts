import { Controller, Get, HttpCode, Param, Version } from "@nestjs/common";
import { ApiBadRequestResponse, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger";
import { plainToClass } from "class-transformer";

import { PaginatedDto } from "../dto/pagination.dto";
import { CoopScheduleResponse } from "../dto/schedules/schedule.response.dto";
import { CoopScheduleStatsRequest } from "../dto/schedules/schedule.stats.request.dto";
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
  find(): Promise<CoopScheduleResponse> {
    return this.service.find();
  }

  @Get(":start_time")
  @Version("2")
  @HttpCode(200)
  @ApiTags("スケジュール")
  @ApiOperation({
    description: "指定されたスケジュールの統計データを返します.",
    operationId: "統計取得",
  })
  @ApiBadRequestResponse()
  findMany1(@Param() request: CoopScheduleStatsRequest): Promise<CoopScheduleStats> {
    console.log(request);
    return this.service.findMany(request.start_time);
  }

  @Get(":start_time/details")
  @Version("2")
  @HttpCode(200)
  @ApiTags("スケジュール")
  @ApiOperation({
    description: "指定されたスケジュールの統計データ詳細を返します.",
    operationId: "統計詳細取得",
  })
  @ApiBadRequestResponse()
  findMany2(@Param() request: CoopScheduleStatsRequest): Promise<CoopScheduleStats[]> {
    console.log(request);
    return this.service.findManyByDangerRate(request.start_time);
  }
}
