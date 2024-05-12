import { ApiProperty } from "@nestjs/swagger"
import { Expose, Transform, Type } from "class-transformer"
import { IsDateString, IsInt, IsOptional, Max, Min } from "class-validator"
import dayjs from "dayjs"

export class GetCoopScheduleRequest {
  @Expose()
  @ApiProperty({
    default: dayjs().toISOString(),
    description:
      'The date and time in ISO 8601 format to use for fetching schedules. If not provided, the "1970-01-01T00:00:00.000Z" and time will be used.',
    required: false
  })
  @IsDateString()
  @Transform(({ value }) => value || dayjs(0).utc().toISOString())
  startTime: Date

  @Expose()
  @ApiProperty({
    default: 5,
    description: "The number of schedules to fetch, up to a maximum of 100.",
    maximum: 100,
    minimum: 1,
    required: false,
    type: "integer"
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => value)
  @Type(() => Number)
  count: number
}
