import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";

import { Mode, Rule } from "./coop_history_detail.dto";

export class CustomCoopScheduleRequest {
  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsDateString()
  startTime: string | null;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsDateString()
  endTime: string | null;

  @ApiProperty({ enum: Rule })
  rule: Rule;

  @ApiProperty({ enum: Mode })
  mode: Mode;

  @ApiProperty()
  stageId: number;

  @ApiProperty({ maxItems: 4, minItems: 4, type: [Number] })
  weaponList: number[];
}
