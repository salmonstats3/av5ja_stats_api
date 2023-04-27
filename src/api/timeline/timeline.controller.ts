import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { AnalyticsResponseDto } from "../dto/analytics/analytics.response.dto";

import { AnalyticsService } from "./timeline.service";

@Controller("timeline")
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get(":schedule_id")
  @ApiTags("分析")
  @ApiOperation({
    description: "データを解析して返します",
    operationId: "Salmon Stats分析",
  })
  @ApiOkResponse({ type: AnalyticsResponseDto })
  getAnalytics(): Promise<AnalyticsResponseDto> {
    return this.service.getAnalytics();
  }
}
