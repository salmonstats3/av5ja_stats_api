import { HttpModule } from '@nestjs/axios'
import { CacheModule } from '@nestjs/cache-manager'
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import {
  PrometheusModule,
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider,
  makeSummaryProvider,
} from '@willsoto/nestjs-prometheus'
import { PrismaModule } from 'nestjs-prisma'

import { RecordsController } from './records/records.controller'
import { RecordsModule } from './records/records.module'
import { RecordsService } from './records/records.service'

import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { HistoriesController } from '@/histories/histories.controller'
import { HistoriesService } from '@/histories/histories.service'
import { MetricsController } from '@/metrics/metrics.controller'
import { ResourcesController } from '@/resources/resources.controller'
import { ResourceModule } from '@/resources/resources.module'
import { ResourcesService } from '@/resources/resources.service'
import { ResultsController } from '@/results/results.controller'
import { ResultsService } from '@/results/results.service'
import { SchedulesController } from '@/schedules/schedules.controller'
import { SchedulesService } from '@/schedules/schedules.service'
import { MetrictMiddleware } from '@/utils/metrics'
import { VersionController } from '@/version/version.controller'
import { VersionService } from '@/version/version.service'

@Module({
  controllers: [
    AppController,
    SchedulesController,
    ResultsController,
    VersionController,
    ResourcesController,
    HistoriesController,
    RecordsController,
  ],
  imports: [
    PrometheusModule.register({
      controller: MetricsController,
      defaultMetrics: {
        config: {},
        enabled: false,
      },
    }),
    ThrottlerModule.forRoot([
      {
        limit: 100,
        ttl: 60 * 5,
      },
    ]),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 60 * 1000,
    }),
    HttpModule.register({
      headers: {
        'accept-encoding': 'gzip, deflate',
      },
    }),
    PrismaModule.forRoot({ isGlobal: true }),
    ResourceModule,
    RecordsModule,
  ],
  providers: [
    AppService,
    makeCounterProvider({
      help: 'Total number of requests by user agent',
      labelNames: ['user_agent'],
      name: 'total_request_count_by_user_agent',
    }),
    makeGaugeProvider({
      help: 'Total results',
      name: 'total_results_count',
    }),
    makeHistogramProvider({
      help: 'Histogram of latency for the request',
      labelNames: ['method', 'status', 'url'],
      name: 'latency_seconds',
    }),
    makeCounterProvider({
      help: 'Total number of requests',
      labelNames: ['method', 'status', 'url'],
      name: 'total_request_count',
    }),
    makeSummaryProvider({
      help: 'Time processing each request',
      labelNames: ['method', 'status'],
      name: 'request_duration',
    }),
    SchedulesService,
    ResultsService,
    VersionService,
    ResourcesService,
    HistoriesService,
    RecordsService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MetrictMiddleware)
      .exclude(
        { method: RequestMethod.ALL, path: '/v(.*)/docs' },
        { method: RequestMethod.ALL, path: '/v(.*)/metrics' },
      )
      .forRoutes({ method: RequestMethod.ALL, path: '/v(.*)/*' })
  }
}
