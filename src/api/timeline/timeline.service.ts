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
  ) { }
  
  async getTimeline(scheduleId: string): Promise<any> {
    return this.prisma.$queryRaw
      `
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
      `
  }
}
