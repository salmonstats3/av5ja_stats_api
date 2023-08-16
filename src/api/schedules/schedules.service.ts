import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Sql } from '@prisma/client/runtime/library';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'nestjs-prisma';
import * as _ from 'underscore';

import {
    CoopScheduleStats,
    CoopScheduleStatsRaw,
    CoopScheduleStatus,
    GoldenIkuraResult,
    GradeResult,
    WaveResult,
} from './dto/schedules.response.dto';

@Injectable()
export class SchedulesService {
    constructor(private readonly prisma: PrismaService) {}

    async get_schedule(schedule_id: string): Promise<CoopScheduleStats> {
        const response: unknown[] = await Promise.all([
            this.prisma.$queryRaw(this.get_schedule_query(schedule_id)),
            this.prisma.$queryRaw(this.get_schedule_status_query(schedule_id)),
            this.prisma.$queryRaw(this.get_wave_query(schedule_id)),
            this.prisma.$queryRaw(this.get_grade_point_query(schedule_id)),
            this.prisma.$queryRaw(this.get_ikura_query(schedule_id)),
        ]);
        const golden_ikura: GoldenIkuraResult[] = (response[4] as unknown[]).map((entry: unknown) => GoldenIkuraResult.fromJSON(entry));
        const { max, min } = {
            max: Math.max(...golden_ikura.map((entry: GoldenIkuraResult) => entry.golden_ikura_num)),
            min: Math.min(...golden_ikura.map((entry: GoldenIkuraResult) => entry.golden_ikura_num)),
        };
        return plainToInstance(CoopScheduleStats, {
            entries: (response[0] as unknown[]).map((entry: CoopScheduleStatsRaw) => CoopScheduleStatus.fromJSON(entry)),
            golden_ikura_num: Object.values({
                ..._.range(min, max, 5).map((entry: number) => GoldenIkuraResult.fromJSON({ count: 0, golden_ikura_num: entry })),
                ...(response[4] as unknown[]).map((entry: unknown) => GoldenIkuraResult.fromJSON(entry)),
            }).sort((a: GoldenIkuraResult, b: GoldenIkuraResult) => b.golden_ikura_num - a.golden_ikura_num),
            grade_point: (response[3] as unknown[]).map((entry: unknown) => GradeResult.fromJSON(entry)),
            status: CoopScheduleStatus.fromJSON(response[1][0]),
            waves: (response[2] as unknown[]).map((entry: unknown) => WaveResult.fromJSON(entry)),
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

    private get_wave_query(schedule_id: string): Sql {
        return Prisma.sql`
        SELECT
          water_level,
          event_type,
          COALESCE(COUNT(is_clear = true OR null)::INT) AS clear,
          COALESCE(COUNT(is_clear = false OR null)::INT) AS failure,
          SUM(golden_ikura_num)::INT AS golden_ikura,
          MAX(golden_ikura_num)::INT AS max_golden_ikura,
		  AVG(golden_ikura_num) FILTER (WHERE is_clear = true)::DECIMAL(7, 3) AS avg_golden_ikura
          FROM
          waves
          WHERE
          golden_ikura_num IS NOT NULL
          AND  
          schedule_id = ${schedule_id}::UUID
          GROUP BY
          water_level,
          event_type
        `;
    }

    private get_grade_point_query(schedule_id: string): Sql {
        return Prisma.sql`
        SELECT
        grade_id,
        grade_point,
        COUNT(*)::INT
        FROM
        (
            SELECT
            MAX(grade_id) AS grade_id,
            (CASE MAX(grade_point) WHEN 999 THEN 999 ELSE MAX(grade_point) END) AS grade_point,
            npln_user_id
            FROM
            players
            WHERE
            schedule_id = ${schedule_id}::UUID
            AND
            grade_point IS NOT NULL
            GROUP BY
            npln_user_id
        ) AS players
        GROUP BY
        grade_id,
        grade_point
        ORDER BY
        grade_id DESC,
        grade_point DESC
        `;
    }

    private get_ikura_query(schedule_id: string): Sql {
        return Prisma.sql`
        SELECT
          golden_ikura_num / 5 * 5 AS golden_ikura_num,
          COUNT(*)::INT
          FROM
          (
          SELECT
            MAX(golden_ikura_num) AS golden_ikura_num,
            UNNEST(members) AS npln_user_id
            FROM
            results
            WHERE
            schedule_id = ${schedule_id}::UUID
            GROUP BY npln_user_id
          ) AS results 
          GROUP BY
          golden_ikura_num / 5 * 5
          ORDER BY
          golden_ikura_num DESC
        `;
    }
}
