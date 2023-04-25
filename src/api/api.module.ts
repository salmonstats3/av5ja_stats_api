import { HttpModule } from "@nestjs/axios";
import { CacheModule, Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

import { AnalyticsController } from "./analytics/analytics.controller";
import { AnalyticsModule } from "./analytics/analytics.module";
import { AnalyticsService } from "./analytics/analytics.service";
import { ApiController } from "./api.controller";
import { ApiService } from "./api.service";
import { AuthorizeController } from "./authorize/authorize.controller";
import { AuthorizeModule } from "./authorize/authorize.module";
import { AuthorizeService } from "./authorize/authorize.service";
import { ResultsModule } from "./results/results.module";
import { ResultsService } from "./results/results.service";
import { SchedulesModule } from "./schedules/schedules.module";
import { SchedulesService } from "./schedules/schedules.service";
import { ScenarioModule } from './scenario/scenario.module';

@Module({
  controllers: [ApiController, AuthorizeController, AnalyticsController],
  imports: [ResultsModule, SchedulesModule, HttpModule, AuthorizeModule, CacheModule.register(), AnalyticsModule, ScenarioModule],
  providers: [PrismaService, ApiService, ResultsService, SchedulesService, AuthorizeService, AnalyticsService],
})
export class ApiModule {}
