import { Schedule } from "@prisma/client";
import { Expose, plainToInstance, Transform } from "class-transformer";
import dayjs from "dayjs";
import { AnalyticsStatusResponseDto } from "src/api/analytics/analytics.status.dto";

export class AnalyticsResponseDto {
  @Expose()
  @Transform((param) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Math.min(param.obj.rows.map((row: any) => Math.min(row.metricValues.map((metric: any) => parseInt(metric.value, 10))))),
  )
  readonly activeUsers: number;

  readonly lastUpdatedAt: string = dayjs(new Date()).toISOString();

  summary: AnalyticsSummaryResponseDto;

  status: AnalyticsStatusResponseDto[];

  schedule: Partial<Schedule>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: any): AnalyticsResponseDto {
    return plainToInstance(AnalyticsResponseDto, json, { excludeExtraneousValues: true });
  }
}

class EggSummary {
  @Expose({ name: "goldenIkuraNum" })
  readonly goldenIkuraNum: number;

  @Expose({ name: "goldenIkuraAssistNum" })
  readonly goldenIkuraAssistNum: number;

  @Expose({ name: "ikuraNum" })
  readonly ikuraNum: number;
}

export class AnalyticsScheduleDto {
  readonly stageId: number;

  @Transform((param) => dayjs(param.value).toDate())
  readonly startTime: Date;

  @Transform((param) => dayjs(param.value).toDate())
  readonly endTime: Date;

  readonly weaponLists: number[];
}

export class AnalyticsSummaryResponseDto {
  @Expose({ name: "_avg" })
  readonly avg: EggSummary;

  @Expose({ name: "_sum" })
  readonly sum: EggSummary;

  @Expose({ name: "_max" })
  readonly max: EggSummary;

  @Expose({ name: "_count" })
  @Transform((param) => param.value.nightLess)
  readonly count: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: any): AnalyticsSummaryResponseDto {
    return plainToInstance(AnalyticsSummaryResponseDto, json, { excludeExtraneousValues: true });
  }
}
