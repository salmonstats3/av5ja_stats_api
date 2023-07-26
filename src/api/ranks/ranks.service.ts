import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Sql } from "@prisma/client/runtime";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "src/prisma.service";
import { RankWaveElement, RankWaveResponse } from "../dto/ranks/rank.wave.response.dto";

@Injectable()
export class RanksService {
  constructor(private readonly prisma: PrismaService) {}

  async getWaveRank(scheduleId: string, waterLevel: number, eventType: number): Promise<RankWaveResponse> {
    const results: any[] = await Promise.all([this.prisma.$queryRaw(this.getWaveRankQuery(scheduleId, waterLevel, eventType))]);
    return {
      water_level: waterLevel,
      event_type: eventType,
      results: results[0].map((result: any) => plainToInstance(RankWaveElement, result, { excludeExtraneousValues: true })),
    };
  }

  getWaveRankQuery(scheduleId: string, waterLevel: number, eventType: number, limit: number = 100): Sql {
    return Prisma.sql`
            WITH results AS 
            (
               SELECT
                  ROW_NUMBER() OVER ( PARTITION BY members 
               ORDER BY
                  waves.golden_ikura_num DESC, quota_num ASC, golden_ikura_pop_num DESC )::SMALLINT AS result_id,
                  wave_id,
                  event_type,
                  water_level,
                  waves.golden_ikura_num,
                  golden_ikura_pop_num,
                  quota_num,
                  members 
               FROM
                  waves 
                  INNER JOIN
                     results 
                     ON waves.schedule_id = results.schedule_id 
                     AND waves.play_time = results.play_time 
               WHERE
                  waves.schedule_id = ${scheduleId}::UUID 
                  AND waves.golden_ikura_num IS NOT NULL 
                  AND waves.is_clear = true 
                  AND waves.golden_ikura_num >= 50 
               ORDER BY
                  waves.golden_ikura_num DESC,
                  result_id 
            )
            SELECT
               RANK() OVER( 
            ORDER BY
               golden_ikura_num DESC, wave_id ASC, quota_num ASC, golden_ikura_pop_num DESC )::SMALLINT AS rank,
               wave_id,
               event_type,
               water_level,
               golden_ikura_num,
               golden_ikura_pop_num 
            FROM
               results 
            WHERE
               water_level = ${waterLevel} 
               AND event_type = ${eventType} 
               AND result_id = 1 LIMIT ${limit}
        `;
  }
}
