import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  imports: [
    ApiModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
