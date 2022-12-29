import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import camelcaseKeys from "camelcase-keys";
import { plainToClass } from "class-transformer";
import { firstValueFrom } from "rxjs";

import { CustomCoopScheduleResponse } from "../dto/schedules/schedule.dto";

@Injectable()
export class SchedulesService {
  constructor(private readonly axios: HttpService) {}

  async findAll(): Promise<CustomCoopScheduleResponse[]> {
    const url = "https://asia-northeast1-tkgstratorwork.cloudfunctions.net/api/schedules/all";
    const response = await firstValueFrom(this.axios.get(url));
    return response.data.map((schedule) =>
      plainToClass(CustomCoopScheduleResponse, camelcaseKeys(schedule)),
    );
  }
}
