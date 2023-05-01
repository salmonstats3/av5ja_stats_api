import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import dayjs from "dayjs";

export class CoopScheduleStatsRequest {
  @ApiProperty({ type: "number" })
  @Transform((param: any) => {
    return dayjs.unix(param.value).toDate();
  })
  start_time: Date;
}
