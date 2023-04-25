import { Controller, Get, Version } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { AnalyticsResponseDto } from "../dto/analytics/analytics.response.dto";

import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get("")
  @Version("1")
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
