import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

import { ApiController } from "./api.controller";
import { ApiService } from "./api.service";
import { ResultsModule } from "./results/results.module";
import { ResultsService } from "./results/results.service";
import { ScenarioCodesModule } from "./scenario_codes/scenario_codes.module";
import { SchedulesModule } from "./schedules/schedules.module";
import { SchedulesService } from "./schedules/schedules.service";

@Module({
  controllers: [ApiController],
  imports: [ResultsModule, SchedulesModule, HttpModule, ScenarioCodesModule],
  providers: [PrismaService, ApiService, ResultsService, SchedulesService],
})
export class ApiModule {}
