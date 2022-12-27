import { CacheInterceptor, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ResultsModule } from './results/results.module';
import { SchedulesModule } from './schedules/schedules.module';
import { ResultsService } from './results/results.service';
import { SchedulesService } from './schedules/schedules.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ApiController],
  providers: [PrismaService, ApiService, ResultsService, SchedulesService],
  imports: [ResultsModule, SchedulesModule, HttpModule],
})
export class ApiModule {}
