import { Controller, Get, Query, Version } from "@nestjs/common";
import { Result } from "@prisma/client";

import { PaginatedDto, PaginatedRequestDto } from "../dto/pagination.dto";

import { ScenarioService } from "./scenario.service";

@Controller("scenario")
export class ScenarioController {
  constructor(private readonly service: ScenarioService) {}

  @Get("")
  @Version("1")
  getAnalytics(@Query() request: PaginatedRequestDto): Promise<PaginatedDto<Partial<Result>>> {
    return this.service.getScenario(request);
  }
}
