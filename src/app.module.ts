import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "nestjs-prisma";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env", ".env.local", ".env.production"],
      isGlobal: true,
    }),
    PrismaModule.forRoot({ isGlobal: true }),
  ],
  providers: [AppService],
})
export class AppModule {}
