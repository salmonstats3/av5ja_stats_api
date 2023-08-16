import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Sql } from '@prisma/client/runtime/library';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'nestjs-prisma';

import { CoopScheduleStats, CoopScheduleStatsRaw, CoopScheduleStatus } from './dto/schedules.response.dto';

@Injectable()
export class SchedulesService {
    constructor(private readonly prisma: PrismaService) {}

    async get_schedule(schedule_id: string): Promise<CoopScheduleStats> {
        const response: unknown[] = await Promise.all([
            this.prisma.$queryRaw(this.get_schedule_query(schedule_id)),
            this.prisma.$queryRaw(this.get_schedule_status_query(schedule_id)),
        ]);
        return plainToInstance(CoopScheduleStats, {
            entries: (response[0] as unknown[]).map((entry: CoopScheduleStatsRaw) => CoopScheduleStatus.fromJSON(entry)),
            status: CoopScheduleStatus.fromJSON(response[1][0]),
        });
    }

    private get_schedule_query(schedule_id: string): Sql {
        return Prisma.sql`
        SELECT
          DATE_TRUNC('HOUR', play_time) + CAST(EXTRACT(MINUTE FROM play_time)::INT / 30 * 30 || ' MINUTES' AS INTERVAL) AS start_time,
		  DATE_TRUNC('HOUR', play_time) + CAST(EXTRACT(MINUTE FROM play_time)::INT / 30 * 30 + 30 || ' MINUTES' AS INTERVAL) AS end_time,
          AVG(danger_rate * 100 * 5)::DECIMAL(7, 3) AS grade_point,
		  SUM(ikura_num)::INT AS ikura_num,
		  MAX(ikura_num)::INT AS max_ikura_num,
		  AVG(ikura_num) FILTER (WHERE is_clear = true)::DECIMAL(7, 3) AS avg_ikura_num,
          VARIANCE(ikura_num) FILTER (WHERE is_clear = true)::DECIMAL(10, 3) AS var_ikura_num,
          STDDEV_POP(ikura_num) FILTER (WHERE is_clear = true)::DECIMAL(7, 3) AS std_ikura_num,
		  SUM(golden_ikura_num)::INT AS golden_ikura_num,
          MAX(golden_ikura_num)::INT AS max_golden_ikura_num,
          AVG(golden_ikura_num) FILTER (WHERE is_clear = true)::DECIMAL(7, 3) AS avg_golden_ikura_num,
          VARIANCE(golden_ikura_num) FILTER (WHERE is_clear = true)::DECIMAL(10, 3) AS var_golden_ikura_num,
          STDDEV_POP(golden_ikura_num) FILTER (WHERE is_clear = true)::DECIMAL(7, 3) AS std_golden_ikura_num,
		  COALESCE(COUNT(boss_id IS NOT NULL OR null)::INT, 0) AS boss_count,
		  COALESCE(COUNT(is_boss_defeated = true OR null)::INT, 0) AS boss_defeated_count,
		  COALESCE(COUNT(is_clear = true OR null))::INT is_clear,
		  COALESCE(COUNT(is_clear = false OR null))::INT is_failure,
          ARRAY[
              COALESCE(COUNT(failure_wave = 1 OR null)::INT, 0),
              COALESCE(COUNT(failure_wave = 2 OR null)::INT, 0),
              COALESCE(COUNT(failure_wave = 3 OR null)::INT, 0)
          ]::INT[] AS failure_waves,
          COUNT(*)::INT shifts_worked
          FROM
          results
          WHERE
          schedule_id = ${schedule_id}::UUID
          GROUP BY
          DATE_TRUNC('HOUR', play_time) + CAST(EXTRACT(MINUTE FROM play_time)::INT / 30 * 30 || ' MINUTES' AS INTERVAL),
		  DATE_TRUNC('HOUR', play_time) + CAST(EXTRACT(MINUTE FROM play_time)::INT / 30 * 30 + 30 || ' MINUTES' AS INTERVAL)
          ORDER BY start_time ASC
          `;
    }

    private get_schedule_status_query(schedule_id: string): Sql {
        return Prisma.sql`
        SELECT
          AVG(danger_rate * 100 * 5)::DECIMAL(7, 3) AS grade_point,
		  SUM(ikura_num)::INT AS ikura_num,
		  MAX(ikura_num)::INT AS max_ikura_num,
		  AVG(ikura_num) FILTER (WHERE is_clear = true)::DECIMAL(7, 3) AS avg_ikura_num,
          VARIANCE(ikura_num) FILTER (WHERE is_clear = true)::DECIMAL(10, 3) AS var_ikura_num,
          STDDEV_POP(ikura_num) FILTER (WHERE is_clear = true)::DECIMAL(7, 3) AS std_ikura_num,
		  SUM(golden_ikura_num)::INT AS golden_ikura_num,
          MAX(golden_ikura_num)::INT AS max_golden_ikura_num,
          AVG(golden_ikura_num) FILTER (WHERE is_clear = true)::DECIMAL(7, 3) AS avg_golden_ikura_num,
          VARIANCE(golden_ikura_num) FILTER (WHERE is_clear = true)::DECIMAL(10, 3) AS var_golden_ikura_num,
          STDDEV_POP(golden_ikura_num) FILTER (WHERE is_clear = true)::DECIMAL(7, 3) AS std_golden_ikura_num,
		  COALESCE(COUNT(boss_id IS NOT NULL OR null)::INT, 0) AS boss_count,
		  COALESCE(COUNT(is_boss_defeated = true OR null)::INT, 0) AS boss_defeated_count,
		  COALESCE(COUNT(is_clear = true OR null))::INT is_clear,
		  COALESCE(COUNT(is_clear = false OR null))::INT is_failure,
          ARRAY[
              COALESCE(COUNT(failure_wave = 1 OR null)::INT, 0),
              COALESCE(COUNT(failure_wave = 2 OR null)::INT, 0),
              COALESCE(COUNT(failure_wave = 3 OR null)::INT, 0)
          ]::INT[] AS failure_waves,
          COUNT(*)::INT shifts_worked
          FROM
          results
          WHERE
          schedule_id = ${schedule_id}::UUID
          `;
    }
}
