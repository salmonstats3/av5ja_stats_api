import { HttpModule } from "@nestjs/axios";
import { CacheModule, Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

import { ApiController } from "./api.controller";
import { ApiService } from "./api.service";
import { AuthorizeController } from "./authorize/authorize.controller";
import { AuthorizeModule } from "./authorize/authorize.module";
import { AuthorizeService } from "./authorize/authorize.service";
import { ResultsModule } from "./results/results.module";
import { ResultsService } from "./results/results.service";
import { ScenarioModule } from "./scenario/scenario.module";
import { SchedulesModule } from "./schedules/schedules.module";
import { SchedulesService } from "./schedules/schedules.service";
import { AnalyticsController } from "./timeline/timeline.controller";
import { AnalyticsModule } from "./timeline/timeline.module";
import { AnalyticsService } from "./timeline/timeline.service";

@Module({
  controllers: [ApiController, AuthorizeController, AnalyticsController],
  imports: [ResultsModule, SchedulesModule, HttpModule, AuthorizeModule, CacheModule.register(), AnalyticsModule, ScenarioModule],
  providers: [PrismaService, ApiService, ResultsService, SchedulesService, AuthorizeService, AnalyticsService],
})
export class ApiModule {}
