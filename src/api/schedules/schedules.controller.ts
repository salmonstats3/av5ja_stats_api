import { CACHE_MANAGER, Controller, Get, Inject } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Cache } from "cache-manager";

import { SchedulesService } from "./schedules.service";

@ApiTags("Schedules")
@Controller("schedules")
export class SchedulesController {
  constructor(private readonly service: SchedulesService, @Inject(CACHE_MANAGER) private readonly manager: Cache) {}

  @Get()
  @ApiOperation({
    description: "",
    operationId: "GET",
  })
  @ApiQuery({ name: "limit", required: false })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async schedules(): Promise<void> {
    return;
  }

  private async cache_manager<T>(id: string, ttl: number, callback: Promise<T>): Promise<T> {
    const previous = await this.manager.get(id);
    if (previous !== undefined) {
      return previous as T;
    }
    const response = await callback;
    this.manager.set(id, response, { ttl: ttl });
    return response;
  }
}
