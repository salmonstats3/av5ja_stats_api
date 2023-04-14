import { HttpModule } from "@nestjs/axios";
import { CacheModule, Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

import { ApiController } from "./api.controller";
import { ApiService } from "./api.service";
import { AuthorizeController } from "./authorize/authorize.controller";
import { AuthorizeModule } from "./authorize/authorize.module";
import { ResultsModule } from "./results/results.module";
import { ResultsService } from "./results/results.service";
import { SchedulesModule } from "./schedules/schedules.module";
import { SchedulesService } from "./schedules/schedules.service";

@Module({
  controllers: [ApiController, AuthorizeController],
  imports: [ResultsModule, SchedulesModule, HttpModule, AuthorizeModule, CacheModule.register()],
  providers: [PrismaService, ApiService, ResultsService, SchedulesService],
})
export class ApiModule {}
