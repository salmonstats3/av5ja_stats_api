import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "nestjs-prisma";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthController } from "./auth/auth.controller";
import { AuthModule } from "./auth/auth.module";
import { Av5jaController } from "./av5ja/av5ja.controller";
import { Av5jaModule } from "./av5ja/av5ja.module";
import { ResultsController } from "./results/results.controller";
import { ResultsModule } from "./results/results.module";
import { SchedulesController } from "./schedules/schedules.controller";
import { SchedulesModule } from "./schedules/schedules.module";
import { SchedulesService } from "./schedules/schedules.service";

@Module({
  controllers: [AppController, AuthController, Av5jaController, ResultsController, SchedulesController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env", ".env.local", ".env.production"],
      isGlobal: true,
    }),
    PrismaModule.forRoot({ isGlobal: true }),
    AuthModule,
    Av5jaModule,
    ResultsModule,
    SchedulesModule,
  ],
  providers: [AppService, SchedulesService],
})
export class AppModule {}
