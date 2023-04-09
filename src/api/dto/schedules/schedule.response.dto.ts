import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

import { Mode } from "../enum/mode";
import { Rule } from "../enum/rule";
import { Setting } from "../enum/setting";

export class CoopScheduleResponse {
  @ApiProperty()
  stage_id: number;

  @ApiProperty()
  start_time: Date;

  @ApiProperty()
  end_time: Date;

  @ApiProperty()
  weapon_list: number[];

  @ApiProperty()
  rare_weapon: number | null;

  @ApiProperty()
  @IsEnum(Mode)
  mode: Mode;

  @ApiProperty()
  @IsEnum(Rule)
  rule: Rule;

  @ApiProperty()
  setting: Setting;
}
