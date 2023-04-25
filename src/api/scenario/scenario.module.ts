import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

import { ScenarioController } from "./scenario.controller";
import { ScenarioService } from "./scenario.service";

@Module({
  controllers: [ScenarioController],
  providers: [ScenarioService, PrismaService],
})
export class ScenarioModule {}
