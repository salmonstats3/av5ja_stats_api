import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Mode, Rule, Setting } from '../splatnet3/coop_history_detail.dto';

export class CustomCoopScheduleResponse {
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
