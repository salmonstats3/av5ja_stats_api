import { Controller, Get, Param, ParseIntPipe, Put } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";

import { PaginatedDto } from "../dto/pagination.dto";
import { CustomCoopScheduleResponse } from "../dto/schedules/schedule.dto";

import { ScheduleResult, SchedulesService } from "./schedules.service";

@Controller("schedules")
@ApiExtraModels(PaginatedDto)
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Get("")
  @ApiTags("スケジュール")
  @ApiOperation({
    description: "スケジュールを一括で取得します",
    operationId: "一括取得",
  })
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: [CustomCoopScheduleResponse] })
  findAll(): Promise<CustomCoopScheduleResponse[]> {
    return this.service.findAll();
  }

  @Put("")
  @ApiTags("スケジュール")
  @ApiOperation({
    description: "スケジュールを一括で登録します",
    operationId: "一括登録",
  })
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: [CustomCoopScheduleResponse] })
  create(): Promise<CustomCoopScheduleResponse[]> {
    return this.service.create();
  }

  @Get(":schedule_id")
  @ApiTags("スケジュール")
  @ApiOperation({
    description: "指定されたスケジュールの統計を取得します",
    operationId: "統計取得",
  })
  @ApiParam({ name: "schedule_id", type: "integer", description: "UNIXTIMESTAMP(UTC準拠)" })
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: [CustomCoopScheduleResponse] })
  find(@Param("schedule_id", ParseIntPipe) scheduleId: number): Promise<ScheduleResult> {
    return this.service.find(scheduleId);
  }
}
