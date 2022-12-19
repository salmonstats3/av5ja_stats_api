import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { isUUID, ValidateNested } from 'class-validator';
import { randomUUID } from 'crypto';
import { Mode, Rule } from './splatnet3/coop_history_detail.dto';
import { Species } from './splatnet3/player.dto';

export class CoopResultCreateResponse {
  @ApiProperty({ format: 'uuid' })
  uuid: string;

  @ApiProperty()
  salmonId: number;

  constructor(uuid: string, salmonId: number) {
    this.uuid = uuid;
    this.salmonId = salmonId;
  }
}

class CoopWaveResultResponse {
  @ApiProperty()
  @Expose()
  waveId: number;
  @ApiProperty()
  @Expose()
  eventType: number;
  @ApiProperty()
  @Expose()
  waterLevel: number;
  @ApiProperty()
  @Expose()
  goldenIkuraNum: number | null;
  @ApiProperty()
  @Expose()
  goldenIkuarPopNum: number;
  @ApiProperty()
  @Expose()
  quotaNum: number | null;
  @ApiProperty()
  @Expose()
  isClear: boolean;
}

class CoopPlayerResultResponse {
  @ApiProperty()
  @Expose()
  pid: string;
  @ApiProperty()
  @Expose()
  name: string;
  @ApiProperty()
  @Expose()
  byname: string;
  @ApiProperty()
  @Expose()
  nameId: string;
  @ApiProperty({ type: [Number], maxItems: 3, minItems: 3 })
  @Expose()
  @Transform((param) =>
    param.value.map((badge) => (badge === -1 ? null : badge))
  )
  badges: number[];
  @ApiProperty()
  @Expose()
  nameplate: number;
  @ApiProperty({ type: [Number], maxItems: 4, minItems: 4 })
  @Expose()
  textColor: number[];
  @ApiProperty()
  @Expose()
  uniform: number;
  @ApiProperty()
  @Expose()
  bossKillCountsTotal: number;
  @ApiProperty({ type: [Number], maxItems: 14, minItems: 14 })
  @Expose()
  @Transform((param) =>
    param.value.map((count) => (count === -1 ? null : count))
  )
  bossKillCounts: number[];
  @ApiProperty()
  @Expose()
  deadCount: number;
  @ApiProperty()
  @Expose()
  helpCount: number;
  @ApiProperty()
  @Expose()
  ikuraNum: number;
  @ApiProperty()
  @Expose()
  goldenIkuraNum: number;
  @ApiProperty()
  @Expose()
  goldenIkuraAssistNum: number;
  @ApiProperty()
  @Expose()
  jobBonus: number | null;
  @ApiProperty()
  @Expose()
  jobRate: number | null;
  @ApiProperty()
  @Expose()
  jobScore: number | null;
  @ApiProperty()
  @Expose()
  kumaPoint: number | null;
  @ApiProperty()
  @Expose()
  gradeId: number | null;
  @ApiProperty()
  @Expose()
  gradePoint: number | null;
  @ApiProperty()
  @Expose()
  smellMeter: number | null;
  @ApiProperty({ enum: Species })
  @Expose()
  species: Species;
  @ApiProperty()
  @Expose()
  specialId: number;
  @ApiProperty({ type: [Number], maxItems: 4, minItems: 3 })
  @Expose()
  specialCounts: number[];
  @ApiProperty({ type: [Number], maxItems: 4, minItems: 3 })
  @Expose()
  weaponList: number[];
}

export class CoopScheduleResponse {
  @ApiProperty()
  @Expose()
  stageId: number;
  @ApiProperty()
  @Expose()
  rareWeapon: number | null;
  @ApiProperty()
  @Expose()
  weaponList: number[];
  @ApiProperty()
  @Expose()
  mode: Mode;
  @ApiProperty()
  @Expose()
  rule: Rule;
}

export class CoopResultResponse {
  @ApiProperty()
  @Expose()
  salmonId: number;
  @ApiProperty({ type: String, format: 'uuid' })
  @Expose()
  uuid: string;
  @ApiProperty({ type: [Number], maxItems: 14, minItems: 14 })
  @Expose()
  bossCounts: number[];
  @ApiProperty({ type: [Number], maxItems: 14, minItems: 14 })
  @Expose()
  bossKillCounts: number[];
  @ApiProperty()
  @Expose()
  ikuraNum: number;
  @ApiProperty()
  @Expose()
  goldenIkuraNum: number;
  @ApiProperty()
  @Expose()
  goldenIkuraAssistNum: number;
  @ApiProperty()
  @Expose()
  nightLess: boolean;
  @ApiProperty()
  @Expose()
  dangerRate: number;
  @ApiProperty({ type: Date })
  @Expose()
  playTime: string;
  @ApiProperty()
  @Expose()
  isClear: boolean;
  @ApiProperty()
  @Expose()
  failureWave: number | null;
  @ApiProperty()
  @Expose()
  isBossDefeated: boolean | null;
  @ApiProperty()
  @Expose()
  bossId: number | null;
  @ApiProperty({ type: [CoopPlayerResultResponse], minItems: 4 })
  @Expose()
  @Type(() => CoopPlayerResultResponse)
  players: CoopPlayerResultResponse[];
  @ApiProperty({ type: [CoopWaveResultResponse], minItems: 3 })
  @Expose()
  @Type(() => CoopWaveResultResponse)
  waves: CoopWaveResultResponse[];
}
