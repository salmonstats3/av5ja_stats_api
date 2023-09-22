import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { HistoriesController } from './histories/histories.controller';
import { HistoriesModule } from './histories/histories.module';
import { HistoriesService } from './histories/histories.service';
import { ResultsController } from './results/results.controller';
import { ResultsModule } from './results/results.module';
import { ResultsService } from './results/results.service';
import { SchedulesController } from './schedules/schedules.controller';
import { SchedulesModule } from './schedules/schedules.module';
import { SchedulesService } from './schedules/schedules.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

@Module({
  controllers: [AppController, SchedulesController, ResultsController, UsersController, HistoriesController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local', '.env.production'],
      isGlobal: true,
    }),
    PrismaModule.forRoot({ isGlobal: true }),
    SchedulesModule,
    ResultsModule,
    UsersModule,
    HistoriesModule,
    AuthModule,
  ],
  providers: [AppService, SchedulesService, ResultsService, UsersService, HistoriesService, AuthService],
})
export class AppModule {}
