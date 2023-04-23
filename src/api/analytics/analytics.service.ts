import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { HttpService } from "@nestjs/axios";
import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { PrismaService } from "src/prisma.service";

import { AnalyticsResponseDto, AnalyticsSummaryResponseDto } from "../dto/analytics/analytics.response.dto";

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
    console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
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
    result.summary = await this.getSummary();
    this.cacheManager.set("analytics", result, { ttl: 60 * 5 });

    return result;
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
  private async getSchedule(): Promise<number> {
    const scheduleId: number | undefined = await this.cacheManager.get("scheduleId");

    if (scheduleId !== undefined) {
      return scheduleId;
    }

    const result = await this.prisma.result.findFirst({
      orderBy: {
        playTime: "desc",
      },
      select: {
        schedule: true,
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
    this.cacheManager.set("scheduleId", result.schedule.scheduleId, { ttl: 60 * 5 });
    return result.schedule.scheduleId;
  }
}
