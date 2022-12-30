import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import camelcaseKeys from "camelcase-keys";
import { plainToClass } from "class-transformer";
import { firstValueFrom } from "rxjs";
import { PrismaService } from "src/prisma.service";

import { CustomCoopScheduleResponse } from "../dto/schedules/schedule.dto";

type WaveResult = {
  golden_ikura_num: number;
  ikura_num: number;
  water_level: number;
  event_type: number;
  count: number;
};

@Injectable()
export class SchedulesService {
  constructor(private readonly axios: HttpService, private readonly prisma: PrismaService) {}

  async findAll(): Promise<CustomCoopScheduleResponse[]> {
    const url = "https://asia-northeast1-tkgstratorwork.cloudfunctions.net/api/schedules/all";
    const response = await firstValueFrom(this.axios.get(url));
    return response.data.map((schedule) =>
      plainToClass(CustomCoopScheduleResponse, camelcaseKeys(schedule)),
    );
  }

  async find(scheduleId: number) {
    return this.prisma.$queryRaw<WaveResult[]>`
    WITH results AS (
      SELECT
      MAX(waves.golden_ikura_num)::INT AS golden_ikura_num,
      MAX(waves.ikura_num)::INT AS ikura_num,
      water_level,
      event_type,
      COUNT(*)::INT
      FROM
      waves
      INNER JOIN
      results
      ON
      waves."resultId" = results.salmon_id
      WHERE
      results.start_time = TO_TIMESTAMP(${scheduleId})
      GROUP BY
      event_type,
      water_level
      ORDER BY
      water_level,
      event_type
    )   
    SELECT
    *   
    FROM
    results;
  `;
  }
}
