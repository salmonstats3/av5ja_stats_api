import { Controller, Get, HttpCode, Version } from "@nestjs/common";
import { ApiBadRequestResponse, ApiExtraModels, ApiOkResponse, ApiOperation, ApiTags, PartialType } from "@nestjs/swagger";
import { Schedule } from "@prisma/client";

import { PaginatedDto } from "../dto/pagination.dto";
import { CoopScheduleDataResponse } from "../dto/schedules/schedule.response.dto";

import { SchedulesService } from "./schedules.service";

@Controller("schedules")
@ApiExtraModels(PaginatedDto)
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Get("")
  @HttpCode(200)
  @Version("2")
  @ApiTags("スケジュール")
  @ApiOperation({
    description: "イカリング3で配信されていたスケジュールを返します.",
    operationId: "取得(SplatNet3)",
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
  findManyV3(): Promise<Partial<Schedule>[]> {
    return this.service.get_schedule_ids();
  }
}
