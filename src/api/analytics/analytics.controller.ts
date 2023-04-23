import { Controller, Get, Version } from "@nestjs/common";

import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get("")
  @Version("1")
  getAnalytics(): Promise<any> {
    return this.service.getAnalytics();
  }
}
