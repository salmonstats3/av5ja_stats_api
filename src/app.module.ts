import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'nestjs-prisma';

@Module({
  controllers: [AppController],
  imports: [
      ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local', '.env.production'],
    }),
    PrismaModule.forRoot({ isGlobal: true }),
  ],
  providers: [AppService],
})
export class AppModule {}
