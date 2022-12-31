import { CacheInterceptor, CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";

import { ApiModule } from "./api/api.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  controllers: [AppController],
  imports: [
    ApiModule,
    CacheModule.registerAsync({
      useFactory: () => ({
        ttl: 10,
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: [".env.prod"],
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
