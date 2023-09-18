import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResultsController } from './results/results.controller';
import { ResultsModule } from './results/results.module';
import { ResultsService } from './results/results.service';
import { SchedulesController } from './schedules/schedules.controller';
import { SchedulesModule } from './schedules/schedules.module';
import { SchedulesService } from './schedules/schedules.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';

@Module({
  controllers: [AppController, SchedulesController, ResultsController, UsersController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local', '.env.production'],
      isGlobal: true,
    }),
    PrismaModule.forRoot({ isGlobal: true }),
    SchedulesModule,
    ResultsModule,
    UsersModule,
  ],
  providers: [AppService, SchedulesService, ResultsService, UsersService],
})
export class AppModule {}
