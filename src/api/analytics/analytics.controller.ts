import { Controller, Get, Version } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

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
  getAnalytics(): Promise<any> {
    return this.service.getAnalytics();
  }
}
