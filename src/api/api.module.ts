import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { OauthService } from './oauth/oauth.service';
import { OauthController } from './oauth/oauth.controller';
import { OauthModule } from './oauth/oauth.module';

@Module({
  providers: [ApiService, OauthService],
  controllers: [OauthController],
  imports: [OauthModule]
})
export class ApiModule {}
