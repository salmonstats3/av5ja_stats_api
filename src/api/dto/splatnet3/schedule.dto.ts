import { ApiProperty } from "@nestjs/swagger";

import { Mode, Rule } from "./coop_history_detail.dto";

export class CustomCoopScheduleRequest {
  @ApiProperty({ type: Date })
  startTime: string;
  @ApiProperty({ enum: Rule })
  rule: Rule;
  @ApiProperty({ enum: Mode })
  mode: Mode;
  @ApiProperty()
  stageId: number;
  @ApiProperty({ maxItems: 4, minItems: 4, type: [Number] })
  weaponList: number[];
}
