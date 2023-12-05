import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from 'nestjs-prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HistoriesController } from './histories/histories.controller';
import { HistoriesModule } from './histories/histories.module';
import { HistoriesService } from './histories/histories.service';
import { RecordsController } from './records/records.controller';
import { RecordsModule } from './records/records.module';
import { RecordsService } from './records/records.service';
import { ResourceController } from './resource/resource.controller';
import { ResourceModule } from './resource/resource.module';
import { ResourceService } from './resource/resource.service';
import { ResultsController } from './results/results.controller';
import { ResultsModule } from './results/results.module';
import { ResultsService } from './results/results.service';
import { SchedulesController } from './schedules/schedules.controller';
import { SchedulesModule } from './schedules/schedules.module';
import { SchedulesService } from './schedules/schedules.service';
import { VersionController } from './version/version.controller';
import { VersionModule } from './version/version.module';
import { VersionService } from './version/version.service';

@Module({
  controllers: [
    AppController,
    SchedulesController,
    ResultsController,
    HistoriesController,
    VersionController,
    ResourceController,
    RecordsController,
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local', '.env.production'],
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 60 * 1000,
    }),
    PrismaModule.forRoot({ isGlobal: true }),
    SchedulesModule,
    ResultsModule,
    HistoriesModule,
    VersionModule,
    ResourceModule,
    RecordsModule,
  ],
  providers: [
    AppService,
    SchedulesService,
    ResultsService,
    HistoriesService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    VersionService,
    ResourceService,
    RecordsService,
  ],
})
export class AppModule {}
