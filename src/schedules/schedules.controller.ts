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
  @Version("3")
  @ApiOperation({ summary: "Fetch Salmon Run schedules for Splatoon 3." })
  @ApiNotFoundResponse()
  @ApiTooManyRequestsResponse()
  @ApiServiceUnavailableResponse()
  @ApiOkResponse({ type: GetCoopScheduleResponse })
  // @UseInterceptors(CacheInterceptor)
  async findAll(): Promise<GetCoopScheduleResponse> {
    return this.service.findAll()
  }
}
