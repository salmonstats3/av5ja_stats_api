import { CacheModule, Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { OauthService } from './oauth/oauth.service';
import { OauthController } from './oauth/oauth.controller';
import { OauthModule } from './oauth/oauth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ResultsController } from './results/results.controller';
import { ResultsModule } from './results/results.module';
import { SchedulesService } from './schedules/schedules.service';
import { SchedulesModule } from './schedules/schedules.module';
import { ResultsService } from './results/results.service';

@Module({
  providers: [ApiService, OauthService, SchedulesService, ResultsService],
  controllers: [OauthController, ResultsController],
  imports: [OauthModule, CacheModule.register(), ThrottlerModule.forRoot({
    ttl: 60 * 10,
    limit: 10,
  }), ResultsModule, SchedulesModule,]
})
export class ApiModule { }
