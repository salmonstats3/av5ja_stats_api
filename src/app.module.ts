import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "nestjs-prisma";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SchedulesController } from "./schedules/schedules.controller";
import { SchedulesModule } from "./schedules/schedules.module";
import { SchedulesService } from "./schedules/schedules.service";
import { ResultsController } from './results/results.controller';
import { ResultsService } from './results/results.service';
import { ResultsModule } from './results/results.module';

@Module({
  controllers: [AppController, SchedulesController, ResultsController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env", ".env.local", ".env.production"],
      isGlobal: true,
    }),
    PrismaModule.forRoot({ isGlobal: true }),
    SchedulesModule,
    ResultsModule,
  ],
  providers: [AppService, SchedulesService, ResultsService],
})
export class AppModule {}
