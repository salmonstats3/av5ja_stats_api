import { Module } from "@nestjs/common"

import { MetricsController } from "@/metrics/metrics.controller"
import { MetricsService } from "@/metrics/metrics.service"

@Module({
  controllers: [MetricsController],
  providers: [MetricsService]
})
export class MetricsModule {}
