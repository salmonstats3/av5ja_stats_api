import { Controller, Get, Param } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { AnalyticsResponseDto } from "../dto/analytics/analytics.response.dto";

import { AnalyticsService } from "./timeline.service";

@Controller("schedules")
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get(":schedule_id")
  @ApiTags("分析")
  @ApiOperation({
    description: "データを解析して返します",
    operationId: "Salmon Stats分析",
  })
  @ApiOkResponse({ type: AnalyticsResponseDto })
  getAnalytics(@Param("schedule_id") scheduleId: string): Promise<AnalyticsResponseDto> {
    return this.service.getAnalytics(scheduleId);
  }
}
