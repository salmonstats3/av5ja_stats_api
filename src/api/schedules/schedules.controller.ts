import { Controller } from "@nestjs/common";
import { ApiExtraModels } from "@nestjs/swagger";

import { PaginatedDto } from "../dto/pagination.dto";

import { SchedulesService } from "./schedules.service";

@Controller("schedules")
@ApiExtraModels(PaginatedDto)
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}
}
