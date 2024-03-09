import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

import { CoopSchedule } from '@/dto/coop_schedule'

export class GetCoopScheduleResponse {
  @ApiProperty({ isArray: true, type: CoopSchedule })
  @Type(() => CoopSchedule)
  schedules: CoopSchedule[]
}
