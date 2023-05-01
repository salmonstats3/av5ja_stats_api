import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { HttpService } from "@nestjs/axios";
import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class AnalyticsService {
  analyticsDataClient: BetaAnalyticsDataClient = new BetaAnalyticsDataClient();
  propertyId = "334254642";

  constructor(
    private readonly axios: HttpService,
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getGradePoint(scheduleId: string): Promise<any> {
    return this.prisma.$queryRaw`
      WITH players AS (
        SELECT
        npln_user_id,
        MAX(grade_point) AS grade_point
        FROM
        players
        WHERE
        schedule_id = ${scheduleId}
        AND
        grade_point IS NOT NULL
        GROUP BY
        npln_user_id
      )
      SELECT
      (CASE grade_point WHEN 999 THEN 999 ELSE grade_point / 10 * 10 END) AS grade_point,
      COUNT(*)::INT
      FROM
      players
      GROUP BY
      (CASE grade_point WHEN 999 THEN 999 ELSE grade_point / 10 * 10 END)
      ORDER BY
      grade_point
    `;
  }

  async getIkuraNum(scheduleId: string): Promise<any> {
    return this.prisma.$queryRaw`
      WITH results AS (
        SELECT
        npln_user_id,
        MAX(results.golden_ikura_num) AS golden_ikura_num,
        MAX(results.ikura_num) AS ikura_num
        FROM
        results
        INNER JOIN
        players
        ON
        players.id = results.id
        WHERE
        results.schedule_id = ${scheduleId}
        GROUP BY
        npln_user_id
    )
    SELECT
    golden_ikura_num / 5 * 5 AS golden_ikura_num,
    COUNT(*)::INT
    FROM
    results
    GROUP BY
    golden_ikura_num / 5 * 5
    ORDER BY
    golden_ikura_num
    `;
  }

  async getAnalytics(scheduleId: string): Promise<any> {
    const analytics = await this.cacheManager.get(`analytics:${scheduleId}`);
    if (analytics !== undefined) {
      return analytics;
    }
    const results: any[] = await Promise.all([this.getGradePoint(scheduleId), this.getIkuraNum(scheduleId), this.getTimeline(scheduleId)]);
    const response = {
      golden_ikura_num: results[1],
      grade_point: results[0],
      status: results[2],
    };
    this.cacheManager.set(`analytics:${scheduleId}`, response, { ttl: 60 * 60 * 1 });
    return response;
  }

  async getTimeline(scheduleId: string): Promise<any> {
    return this.prisma.$queryRaw`
      SELECT
      DATE_TRUNC('HOUR', play_time) + CAST(EXTRACT(MINUTE FROM play_time)::INT / 30 * 30 || ' MINUTES' AS INTERVAL) AS play_time,
      AVG(danger_rate * 100 * 5 - 800)::DECIMAL(6, 3) AS grade_point,
      MAX(golden_ikura_num) AS max_golden_ikura_num,
      AVG(golden_ikura_num) FILTER (WHERE is_clear = true)::DECIMAL(6, 3) AS avg_golden_ikura_num,
      ARRAY[
          COALESCE(COUNT(is_clear = true OR null) FILTER (WHERE danger_rate * 100 * 5 - 800 < 100), 0)::INT,
          COALESCE(COUNT(is_clear = true OR null) FILTER (WHERE danger_rate * 100 * 5 - 800 BETWEEN 100 AND 400), 0)::INT,
          COALESCE(COUNT(is_clear = true OR null) FILTER (WHERE danger_rate * 100 * 5 - 800 > 400), 0)::INT
      ] AS is_clear_by_rate,
      ARRAY[
          COALESCE(COUNT(is_clear = false OR null) FILTER (WHERE danger_rate * 100 * 5 - 800 < 100), 0)::INT,
          COALESCE(COUNT(is_clear = false OR null) FILTER (WHERE danger_rate * 100 * 5 - 800 BETWEEN 100 AND 400), 0)::INT,
          COALESCE(COUNT(is_clear = false OR null) FILTER (WHERE danger_rate * 100 * 5 - 800 > 400), 0)::INT
      ] AS is_failure_by_rate,
      ARRAY[
          COALESCE(COUNT(failure_wave = 1 OR null)::INT, 0),
          COALESCE(COUNT(failure_wave = 2 OR null)::INT, 0),
          COALESCE(COUNT(failure_wave = 3 OR null)::INT, 0)
      ] AS failure_wave
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
