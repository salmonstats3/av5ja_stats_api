import { CacheInterceptor, CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "nestjs-prisma";

import { OauthModule } from "./api/oauth/oauth.module";
import { ResultsModule } from "./api/results/results.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";


@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env"],
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      limit: 10,
      ttl: 60 * 10,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    OauthModule,
    ResultsModule,
    PrismaModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
