import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { HttpService } from "@nestjs/axios";
import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { PrismaService } from "src/prisma.service";
import dayjs from "dayjs";
import { ceil } from "src/helper";
import { Prisma } from "@prisma/client";
import { Sql } from "@prisma/client/runtime";

dayjs.extend(ceil);

@Injectable()
export class AnalyticsService {
  analyticsDataClient: BetaAnalyticsDataClient = new BetaAnalyticsDataClient();
  propertyId = "334254642";

  constructor(
    private readonly axios: HttpService,
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getAnalytics(scheduleId: string): Promise<any> {
    const analytics = await this.cacheManager.get(`analytics:${scheduleId}`);
    const ttl: number = dayjs().ceil(30).diff(dayjs(), "second") - 60;
    if (analytics !== undefined) {
      return analytics;
    }

    const results: any[] = await Promise.all([
      this.prisma.$queryRaw(this.getGradePointQuery(scheduleId)),
      this.prisma.$queryRaw(this.getIkuraNumQuery(scheduleId)),
      this.prisma.$queryRaw(this.getIkuraDistQuery(scheduleId)),
      this.prisma.$queryRaw(this.getTimelineQuery(scheduleId)),
      this.prisma.$queryRaw(this.getWavesQuery(scheduleId)),
    ]);
    const response = {
      grade_point: results[0],
      golden_ikura_num: results[1],
      distribution: results[2][0],
      status: results[3],
      waves: [0, 1, 2, 3, 4, 5, 6, 7, 8].map((eventType: number) => results[4].filter((result: any) => result.event_type === eventType)),
    };
    this.cacheManager.set(`analytics:${scheduleId}`, response, { ttl: ttl });
    return response;
  }

  private getIkuraDistQuery(scheduleId: string): Sql {
    return Prisma.sql`
    SELECT
	  AVG(golden_ikura_num)::NUMERIC(8, 3) AS golden_ikura_num_avg,
	  STDDEV(golden_ikura_num)::NUMERIC(8, 3) AS golden_ikura_num_std,
	  AVG(ikura_num)::NUMERIC(8, 3) AS ikura_num_avg,
	  STDDEV(ikura_num)::NUMERIC(8, 3) AS ikura_num_std
	  FROM
    (
      SELECT
      npln_user_id,
      MAX(results.golden_ikura_num) AS golden_ikura_num,
      MAX(results.ikura_num) AS ikura_num,
      MAX(grade_point) AS grade_point
      FROM
      players
      INNER JOIN
      results
      ON
      players.id = results.id
      AND
      results.schedule_id = ${scheduleId}
      GROUP BY
      npln_user_id
    ) AS players
    `;
  }

  private getIkuraNumQuery(scheduleId: string): Sql {
    return Prisma.sql`
    SELECT
    golden_ikura_num / 5 * 5 AS golden_ikura_num,
    COUNT(*)::INT
    FROM
    (
      SELECT
      npln_user_id,
      MAX(results.golden_ikura_num) AS golden_ikura_num,
      MAX(results.ikura_num) AS ikura_num,
      MAX(grade_point) AS grade_point
      FROM
      players
      INNER JOIN
      results
      ON
      players.id = results.id
      AND
      results.schedule_id = ${scheduleId}
      GROUP BY
      npln_user_id
    ) AS players
    GROUP BY
    golden_ikura_num / 5 * 5
    ORDER BY
    golden_ikura_num
      `;
  }

  private getWavesQuery(scheduleId: string): Sql {
    return Prisma.sql`
      SELECT
      water_level,
      event_type,
      COUNT(*)::INT AS occurrence,
      COALESCE(COUNT(waves.is_clear = true OR null)::INT) AS is_clear,
      MAX(waves.golden_ikura_num) AS golden_ikura_num
      FROM
      waves
      INNER JOIN
      results
      ON
      results.id = waves.id
      AND
      waves.golden_ikura_num IS NOT NULL
      AND  
      schedule_id = ${scheduleId}
      GROUP BY
      water_level,
      event_type
      `;
  }

  private getGradePointQuery(scheduleId: string): Sql {
    return Prisma.sql`
      SELECT
      (CASE grade_point WHEN 999 THEN 999 ELSE grade_point / 200 * 200 END) AS grade_point,
      COUNT(*)::INT
      FROM
      (
        SELECT
        npln_user_id,
        MAX(results.golden_ikura_num) AS golden_ikura_num,
        MAX(results.ikura_num) AS ikura_num,
        MAX(grade_point) AS grade_point
        FROM
        players
        INNER JOIN
        results
        ON
        players.id = results.id
        AND
        results.schedule_id = ${scheduleId}
        AND
        grade_point IS NOT NULL
        GROUP BY
        npln_user_id
      ) AS players
      GROUP BY
      (CASE grade_point WHEN 999 THEN 999 ELSE grade_point / 200 * 200 END)
      ORDER BY
      grade_point
      `;
  }

  private getTimelineQuery(scheduleId: string): Sql {
    return Prisma.sql`
    SELECT
      DATE_TRUNC('HOUR', play_time) + CAST(EXTRACT(MINUTE FROM play_time)::INT / 30 * 30 || ' MINUTES' AS INTERVAL) AS play_time,
      AVG(danger_rate * 100 * 5 - 800)::DECIMAL(6, 3) AS grade_point,
      MAX(golden_ikura_num) AS max_golden_ikura_num,
      AVG(golden_ikura_num) FILTER (WHERE is_clear = true)::DECIMAL(6, 3) AS avg_golden_ikura_num,
      ARRAY[
          COALESCE(COUNT(is_clear = true OR null) FILTER (WHERE danger_rate * 100 * 5 - 800 >= 0), 0)::INT,
          COALESCE(COUNT(is_clear = true OR null) FILTER (WHERE danger_rate * 100 * 5 - 800 >= 200), 0)::INT,
          COALESCE(COUNT(is_clear = true OR null) FILTER (WHERE danger_rate * 100 * 5 - 800 >= 400), 0)::INT,
          COALESCE(COUNT(is_clear = true OR null) FILTER (WHERE danger_rate * 100 * 5 - 800 >= 600), 0)::INT
      ] AS is_clear_by_rate,
      ARRAY[
          COALESCE(COUNT(is_clear = false OR null) FILTER (WHERE danger_rate * 100 * 5 - 800 >= 0), 0)::INT,
          COALESCE(COUNT(is_clear = false OR null) FILTER (WHERE danger_rate * 100 * 5 - 800 >= 200), 0)::INT,
          COALESCE(COUNT(is_clear = false OR null) FILTER (WHERE danger_rate * 100 * 5 - 800 >= 400), 0)::INT,
          COALESCE(COUNT(is_clear = false OR null) FILTER (WHERE danger_rate * 100 * 5 - 800 >= 600), 0)::INT
      ] AS is_failure_by_rate,
      ARRAY[
          COALESCE(COUNT(failure_wave = 1 OR null)::INT, 0),
          COALESCE(COUNT(failure_wave = 2 OR null)::INT, 0),
          COALESCE(COUNT(failure_wave = 3 OR null)::INT, 0)
      ] AS failure_wave,
      COUNT(*)::INT shifts_worked
      FROM
      results
      WHERE
      schedule_id = ${scheduleId}
      GROUP BY
      DATE_TRUNC('HOUR', play_time) + CAST(EXTRACT(MINUTE FROM play_time)::INT / 30 * 30 || ' MINUTES' AS INTERVAL)
      ORDER BY play_time DESC
      `;
  }
}
