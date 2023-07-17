import { Controller, Get, HttpCode, Query, Version } from "@nestjs/common";
import { ApiBadRequestResponse, ApiExtraModels, ApiOkResponse, ApiOperation, ApiTags, PartialType } from "@nestjs/swagger";
import { Schedule } from "@prisma/client";

import { PaginatedDto } from "../dto/pagination.dto";
import { CoopScheduleRequestQuery } from "../dto/schedules/schedule.request.dto";
import { CoopScheduleDataResponse } from "../dto/schedules/schedule.response.dto";

import { SchedulesService } from "./schedules.service";

@Controller("schedules")
@ApiExtraModels(PaginatedDto)
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Get("")
  @HttpCode(200)
  @Version("1")
  @ApiTags("スケジュール")
  @ApiOperation({
    deprecated: true,
    description: "イカリング3で配信されていたスケジュールを返します.",
    operationId: "取得(SplatNet3)V2",
  })
  @ApiBadRequestResponse()
  @ApiOkResponse({ type: [CoopScheduleDataResponse] })
  findManyV1(): Promise<CoopScheduleDataResponse[]> {
    return this.service.get_schedules();
  }

  @Get("")
  @HttpCode(200)
  @Version("2")
  @ApiTags("スケジュール")
  @ApiOperation({
    description: "イカリング3で配信されていたスケジュールを返します.",
    operationId: "取得(SplatNet3)V3",
  })
  @ApiBadRequestResponse()
  @ApiOkResponse({ type: [CoopScheduleDataResponse] })
  findManyV2(): Promise<CoopScheduleDataResponse[]> {
    return this.service.get_schedules();
  }

  @Get("")
  @HttpCode(200)
  @ApiTags("スケジュール")
  @ApiOperation({
    description: "Salmon Stats+に登録されているスケジュールを返します.",
    operationId: "取得(Salmon Stats+)",
  })
  @ApiBadRequestResponse()
  @ApiOkResponse({ type: [PartialType<Schedule>] })
  findManyV3(@Query() param: CoopScheduleRequestQuery): Promise<Partial<Schedule>[]> {
    return this.service.get_schedule_ids(param);
  }
}
