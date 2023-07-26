import { CacheModule, Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { OauthService } from './oauth/oauth.service';
import { OauthController } from './oauth/oauth.controller';
import { OauthModule } from './oauth/oauth.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  providers: [ApiService, OauthService],
  controllers: [OauthController],
  imports: [OauthModule, CacheModule.register(), ThrottlerModule.forRoot({
    ttl: 60 * 10,
    limit: 10,
  }),]
})
export class ApiModule { }
