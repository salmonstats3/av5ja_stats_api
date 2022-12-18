import { Expose, Transform, Type } from 'class-transformer';
import { Mode, Rule } from './splatnet3/coop_history_detail.dto';
import { Species } from './splatnet3/player.dto';

export class CoopResultCreateResponse {
  id: string;
  salmonId: number;

  constructor(id: string, salmonId: number) {
    this.id = id;
    this.salmonId = salmonId;
  }
}

class CoopWaveResultResponse {
  @Expose()
  waveId: number;
  @Expose()
  eventType: number;
  @Expose()
  waterLevel: number;
  @Expose()
  goldenIkuraNum: number;
  @Expose()
  goldenIkuarPopNum: number;
  @Expose()
  quotaNum: number;
  @Expose()
  isClear: number;
}

class CoopPlayerResultResponse {
  @Expose()
  pid: string;
  @Expose()
  name: string;
  @Expose()
  byname: string;
  @Expose()
  nameId: string;
  @Expose()
  @Transform((param) =>
    param.value.map((badge) => (badge === -1 ? null : badge))
  )
  badges: number[];
  @Expose()
  nameplate: number;
  @Expose()
  textColor: number[];
  @Expose()
  uniform: number;
  @Expose()
  bossKillCountsTotal: number;
  @Expose()
  @Transform((param) =>
    param.value.map((count) => (count === -1 ? null : count))
  )
  bossKillCounts: number[];
  @Expose()
  deadCount: number;
  @Expose()
  helpCount: number;
  @Expose()
  ikuraNum: number;
  @Expose()
  goldenIkuraNum: number;
  @Expose()
  goldenIkuraAssistNum: number;
  @Expose()
  jobBonus: number | null;
  @Expose()
  jobRate: number | null;
  @Expose()
  jobScore: number | null;
  @Expose()
  kumaPoint: number | null;
  @Expose()
  gradeId: number | null;
  @Expose()
  gradePoint: number | null;
  @Expose()
  smellMeter: number | null;
  @Expose()
  species: Species;
  @Expose()
  specialId: number;
  @Expose()
  specialCounts: number[];
  @Expose()
  weaponList: number[];
}

export class CoopScheduleResponse {
  @Expose()
  stageId: number;
  @Expose()
  rareWeapon: number | null;
  @Expose()
  weaponList: number[];
  @Expose()
  mode: Mode;
  @Expose()
  rule: Rule;
}

export class CoopResultResponse {
  @Expose()
  salmonId: number;
  @Expose()
  uuid: string;
  @Expose()
  bossCounts: number[];
  @Expose()
  bossKillCounts: number[];
  @Expose()
  ikuraNum: number;
  @Expose()
  goldenIkuraNum: number;
  @Expose()
  goldenIkuraAssistNum: number;
  @Expose()
  nightLess: boolean;
  @Expose()
  dangerRate: number;
  @Expose()
  playTime: string;
  @Expose()
  isClear: boolean;
  @Expose()
  failureWave: number | null;
  @Expose()
  isBossDefeated: boolean | null;
  @Expose()
  bossId: number | null;
  @Expose()
  @Type(() => CoopPlayerResultResponse)
  players: CoopPlayerResultResponse[];
  @Expose()
  @Type(() => CoopWaveResultResponse)
  waves: CoopWaveResultResponse[];
}
