import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { HttpService } from "@nestjs/axios";
import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Schedule } from "@prisma/client";
import { Cache } from "cache-manager";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "src/prisma.service";

import { AnalyticsResponseDto, AnalyticsSummaryResponseDto } from "../dto/analytics/analytics.response.dto";

import { AnalyticsStatusResponseDto } from "./analytics.status.dto";

@Injectable()
export class AnalyticsService {
  analyticsDataClient: BetaAnalyticsDataClient = new BetaAnalyticsDataClient();
  propertyId = "334254642";

  constructor(
    private readonly axios: HttpService,
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getAnalytics(): Promise<AnalyticsResponseDto> {
    const analytics: AnalyticsResponseDto = await this.cacheManager.get("analytics");
    if (analytics !== undefined) {
      return analytics;
    }
    const request = {
      dimensions: [
        {
          name: "platform",
        },
      ],
      metrics: [
        {
          name: "activeUsers",
          type: "TYPE_INTEGER",
        },
      ],
      minuteRanges: [
        {
          endMinutesAgo: 0,
          startMinutesAgo: 29,
        },
      ],
      property: `properties/${this.propertyId}`,
    };

    const result: AnalyticsResponseDto = AnalyticsResponseDto.fromJSON(await this.analyticsDataClient.runRealtimeReport(request))[0];
    const results = await Promise.all([this.getSummary(), this.getStatus(), this.getSchedule()]);
    result.summary = results[0];
    result.status = results[1];
    result.schedule = results[2];
    this.cacheManager.set("analytics", result, { ttl: 60 * 5 });

    return result;
  }

  /**
   *
   * @returns 直近24時間のデータ
   */
  private async getStatus(): Promise<AnalyticsStatusResponseDto[]> {
    const status: AnalyticsStatusResponseDto[] = await this.cacheManager.get("statuses");
    if (status !== undefined) {
      return status;
    }
    const results = await this.prisma.$queryRaw<AnalyticsStatusResponseDto[]>`
      SELECT
      DATE_TRUNC('hour', results.play_time) AS play_time,
      COUNT(*)::INT AS count,
      COALESCE(COUNT(is_clear=true OR null)::INT, 0) is_clear,
      COALESCE(AVG(grade_point)::FLOAT, 0) grade_point
      FROM
      results
      INNER JOIN
      players
      ON
      players.result_id = results.salmon_id
      INNER JOIN
      schedules
      ON
      schedules.schedule_id = results.schedule_id
      WHERE
      results.play_time BETWEEN NOW() - INTERVAL '120 HOURS' AND NOW()
      AND
      players.grade_point IS NOT NULL
      AND
      schedules.mode = 'REGULAR'
      GROUP BY
      DATE_TRUNC('hour', results.play_time)
      ORDER BY play_time DESC
      LIMIT 24
      `;
    const statuses = results
      .map((result) => plainToInstance(AnalyticsStatusResponseDto, result))
      .sort((a, b) => a.play_time.getTime() - b.play_time.getTime());
    this.cacheManager.set("statuses", statuses, { ttl: 60 * 60 });
    return statuses;
  }

  /**
   * 概要を返す
   */
  private async getSummary(): Promise<AnalyticsSummaryResponseDto> {
    return AnalyticsSummaryResponseDto.fromJSON(
      await this.prisma.result.aggregate({
        _avg: {
          goldenIkuraAssistNum: true,
          goldenIkuraNum: true,
          ikuraNum: true,
        },
        _count: {
          nightLess: true,
          scenarioCode: true,
        },
        _max: {
          goldenIkuraAssistNum: true,
          goldenIkuraNum: true,
          ikuraNum: true,
        },
        _sum: {
          goldenIkuraAssistNum: true,
          goldenIkuraNum: true,
          ikuraNum: true,
        },
      }),
    );
  }

  /**
   * 最新のスケジュールIDを取得する
   */
  private async getSchedule(): Promise<Partial<Schedule>> {
    const schedule: Partial<Schedule> | undefined = await this.cacheManager.get("schedule");

    if (schedule !== undefined) {
      return schedule;
    }

    const result = await this.prisma.result.findFirst({
      orderBy: {
        playTime: "desc",
      },
      select: {
        schedule: {
          select: {
            endTime: true,
            stageId: true,
            startTime: true,
            weaponList: true,
          },
        },
      },
      where: {
        playTime: {
          lte: new Date(),
        },
        schedule: {
          endTime: {
            not: null,
          },
          startTime: {
            not: null,
          },
        },
      },
    });
    this.cacheManager.set("schedule", result.schedule, { ttl: 60 * 5 });
    return result.schedule;
  }
}
