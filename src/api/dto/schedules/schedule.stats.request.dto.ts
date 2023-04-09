import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import dayjs from "dayjs";

export class CoopScheduleStatsRequest {
  @ApiProperty({ type: "number" })
  @Transform((param: any) => {
    console.log(param.value);
    return dayjs.unix(param.value).toDate();
  })
  start_time: Date;
}
