import { CacheInterceptor } from "@nestjs/cache-manager"
import { Controller, Get, Query, UseInterceptors, Version } from "@nestjs/common"
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiTooManyRequestsResponse
} from "@nestjs/swagger"

import { CoopSchedule } from "@/dto/coop_schedule"
import { GetCoopScheduleRequest } from "@/dto/request/schedule.dto"
import { GetCoopScheduleResponse } from "@/dto/schedule.dto"
import { SchedulesService } from "@/schedules/schedules.service"

@ApiTags("Schedules")
@Controller("schedules")
@UseInterceptors(CacheInterceptor)
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Get()
  @Version("1")
  @ApiOperation({
    deprecated: true,
    summary: "Fetch Salmon Run schedules for Splatoon 3."
  })
  @ApiNotFoundResponse()
  @ApiTooManyRequestsResponse()
  @ApiServiceUnavailableResponse()
  @ApiOkResponse({ type: GetCoopScheduleResponse })
  async findL(): Promise<CoopSchedule[]> {
    return (await this.service.find()).schedules
  }

  @Get()
  @Version("2")
  @ApiOperation({
    deprecated: true,
    summary: "Fetch Salmon Run schedules for Splatoon 3."
  })
  @ApiNotFoundResponse()
  @ApiTooManyRequestsResponse()
  @ApiServiceUnavailableResponse()
  @ApiOkResponse({ type: GetCoopScheduleResponse })
  @UseInterceptors(CacheInterceptor)
  async findAllL(@Query() request: GetCoopScheduleRequest): Promise<CoopSchedule[]> {
    return (await this.service.findAll(request)).schedules
  }

  @Get()
  @Version("3")
  @ApiOperation({ summary: "Fetch Salmon Run schedules for Splatoon 3." })
  @ApiNotFoundResponse()
  @ApiTooManyRequestsResponse()
  @ApiServiceUnavailableResponse()
  @ApiOkResponse({ type: GetCoopScheduleResponse })
  // @UseInterceptors(CacheInterceptor)
  async findAll(@Query() request: GetCoopScheduleRequest): Promise<GetCoopScheduleResponse> {
    return this.service.findAll(request)
  }
}
