import { Module } from "@nestjs/common"

import { SchedulesController } from "@/schedules/schedules.controller"
import { SchedulesService } from "@/schedules/schedules.service"

@Module({
  controllers: [SchedulesController],
  imports: [],
  providers: [SchedulesService]
})
export class SchedulesModule {}
