import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "nestjs-prisma";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [AppController, AuthController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env", ".env.local", ".env.production"],
      isGlobal: true,
    }),
    PrismaModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  providers: [AppService],
})
export class AppModule {}
