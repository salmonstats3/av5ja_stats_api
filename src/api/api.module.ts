import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

import { ApiController } from "./api.controller";
import { ApiService } from "./api.service";
import { ResultsModule } from "./results/results.module";
import { ResultsService } from "./results/results.service";
import { SchedulesModule } from "./schedules/schedules.module";
import { SchedulesService } from "./schedules/schedules.service";
import { AuthorizeController } from "./authorize/authorize.controller";
import { AuthorizeModule } from "./authorize/authorize.module";

@Module({
  controllers: [ApiController, AuthorizeController],
  imports: [ResultsModule, SchedulesModule, HttpModule, AuthorizeModule],
  providers: [PrismaService, ApiService, ResultsService, SchedulesService],
})
export class ApiModule {}
