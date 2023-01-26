import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

import { ScenarioCodesController } from "./scenario_codes.controller";
import { ScenarioCodesService } from "./scenario_codes.service";

@Module({
  controllers: [ScenarioCodesController],
  providers: [ScenarioCodesService, PrismaService],
})
export class ScenarioCodesModule {}
