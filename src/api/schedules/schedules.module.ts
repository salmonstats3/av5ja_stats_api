import { Module } from '@nestjs/common';
import { SchedulesController } from './schedules.controller';

@Module({
  controllers: [SchedulesController]
})
export class SchedulesModule {}
