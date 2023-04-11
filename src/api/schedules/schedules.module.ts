import { HttpModule } from "@nestjs/axios";
import { CacheModule, Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

import { SchedulesController } from "./schedules.controller";
import { SchedulesService } from "./schedules.service";

@Module({
  controllers: [SchedulesController],
  imports: [HttpModule, CacheModule.register({ ttl: 60 * 60 * 6 })],
  providers: [SchedulesService, PrismaService],
})
export class SchedulesModule {}
