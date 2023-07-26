import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ApiModule } from "./api/api.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ApiController } from './api/api.controller';

@Module({
  controllers: [AppController, ApiController],
  imports: [
    ApiModule,
    ConfigModule.forRoot({
      envFilePath: [".env"],
    }),
  ],
  providers: [AppService],
})
export class AppModule { }
