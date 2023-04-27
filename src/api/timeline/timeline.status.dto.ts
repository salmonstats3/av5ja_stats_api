import { Expose, Transform } from "class-transformer";
import dayjs from "dayjs";

export class AnalyticsStatusResponseDto {
  @Transform((param) => dayjs(param.value).toDate())
  readonly play_time: Date;

  @Expose({ name: "count" })
  readonly play_counts: number;

  @Expose()
  @Transform((param) => param.obj.is_clear / param.obj.count)
  readonly clear_ratio: number;
  readonly grade_point: number;
}
