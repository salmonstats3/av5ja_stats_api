import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

import { Mode } from "../enum/mode";
import { Rule } from "../enum/rule";
import { Setting } from "../enum/setting";

export class CoopScheduleResponse {
  @ApiProperty()
  stageId: number;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  endTime: Date;

  @ApiProperty()
  weaponList: number[];

  @ApiProperty()
  rareWeapon: number | null;

  @ApiProperty()
  @IsEnum(Mode)
  mode: Mode;

  @ApiProperty()
  @IsEnum(Rule)
  rule: Rule;

  @ApiProperty()
  setting: Setting;
}
