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

enum WaterId {
  LOW_TIDE = 0,
  NORMAL = 1,
  HIGH_TIDE = 2,
}

enum EventId {
  WATER_LEVELS = 0,
  RUSH = 1,
  GOLDIE_SEEKING = 2,
  GRILLER = 3,
  FOG = 4,
  THE_MOTHERSHIP = 5,
  COHOCK_CHARGE = 6,
  GIANT_TORNADO = 7,
  MUDMOUTH = 8,
}

enum EnemyId {
  'オカシラシャケ' = 23,
}

class CoopWaveResultResponse {
  @ApiProperty({ description: '1~4の値が入ります' })
  @Expose()
  waveId: number;

  @ApiProperty({
    type: Number,
    enum: EventId,
    enumName: 'EventId',
  })
  @Expose()
  eventType: EventId;

  @ApiProperty({ type: Number, enum: WaterId, enumName: 'WaterId' })
  @Expose()
  waterLevel: number;

  @ApiProperty({
    nullable: true,
    description: 'EX-WAVEでは常に`null`が入ります',
  })
  @Expose()
  goldenIkuraNum: number | null;

  @ApiProperty()
  @Expose()
  goldenIkuraPopNum: number;

  @ApiProperty({ nullable: true })
  @Expose()
  quotaNum: number | null;

  @ApiProperty({
    description: 'オカシラシャケを討伐できなかった場合は`false`が入ります',
  })
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

  @ApiProperty({
    type: [Number],
    maxItems: 3,
    minItems: 3,
    description: 'バッジのIDが返りますがつけていない場合は`null`が入ります',
  })
  @Expose()
  @Transform((param) =>
    param.value.map((badge) => (badge === -1 ? null : badge))
  )
  badges: number[];

  @ApiProperty({ description: 'ネームプレートのIDが入ります' })
  @Expose()
  nameplate: number;

  @ApiProperty({
    type: [Number],
    maxItems: 4,
    minItems: 4,
    description: 'RGBAが入ります',
  })
  @Expose()
  textColor: number[];

  @ApiProperty({ description: 'ユニフォームIDが入ります' })
  @Expose()
  uniform: number;

  @ApiProperty()
  @Expose()
  bossKillCountsTotal: number;

  @ApiProperty({
    type: [Number],
    maxItems: 14,
    minItems: 14,
    description: 'わからない場合は`null`が入ります',
  })
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

  @ApiProperty({ description: 'コンテナに入れた金イクラの数です' })
  @Expose()
  goldenIkuraNum: number;

  @ApiProperty()
  @Expose()
  goldenIkuraAssistNum: number;

  @ApiProperty({ nullable: true })
  @Expose()
  jobBonus: number | null;

  @ApiProperty({ nullable: true })
  @Expose()
  jobRate: number | null;

  @ApiProperty({ nullable: true })
  @Expose()
  jobScore: number | null;

  @ApiProperty({ nullable: true })
  @Expose()
  kumaPoint: number | null;

  @ApiProperty({ nullable: true, minimum: 0, maximum: 8 })
  @Expose()
  gradeId: number | null;

  @ApiProperty({ nullable: true, minimum: 0, maximum: 999 })
  @Expose()
  gradePoint: number | null;

  @ApiProperty({
    nullable: true,
    minimum: 0,
    maximum: 5,
    description: 'オカシラメーター',
  })
  @Expose()
  smellMeter: number | null;

  @ApiProperty({ enum: Species })
  @Expose()
  species: Species;

  @ApiProperty()
  @Expose()
  specialId: number;

  @ApiProperty({ type: [Number], maxItems: 4, minItems: 0 })
  @Expose()
  specialCounts: number[];

  @ApiProperty({ type: [Number], maxItems: 4, minItems: 0 })
  @Expose()
  weaponList: number[];
}

export class CoopScheduleResponse {
  @ApiProperty()
  @Expose()
  stageId: number;

  @ApiProperty({ nullable: true })
  @Expose()
  rareWeapon: number | null;

  @ApiProperty()
  @Expose()
  weaponList: number[];

  @ApiProperty()
  @Expose()
  mode: Mode;

  @ApiProperty({ enum: Rule })
  @Expose()
  rule: Rule;
}

export class CoopResultResponse {
  @ApiProperty({ description: '固有のID' })
  @Expose()
  salmonId: number;

  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'リザルトに紐付けられたUUID',
  })
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

  @ApiProperty({ description: '夜イベントを含むかどうか' })
  @Expose()
  nightLess: boolean;

  @ApiProperty()
  @Expose()
  dangerRate: number;

  @ApiProperty({ type: Date })
  @Expose()
  playTime: Date;

  @ApiProperty({
    description: 'WAVE3をクリアすればオカシラ失敗しても`true`が返ります',
  })
  @Expose()
  isClear: boolean;

  @ApiProperty({ nullable: true, description: '失敗したWAVEのidが返ります' })
  @Expose()
  failureWave: number | null;

  @ApiProperty({
    nullable: true,
    description: 'オカシラシャケを討伐できたかが返ります',
  })
  @Expose()
  isBossDefeated: boolean | null;

  @ApiProperty({ nullable: true, description: 'オカシラシャケのIDが返ります' })
  @Expose()
  bossId: number | null;

  @ApiProperty({ type: CoopScheduleResponse })
  @Expose()
  @Type(() => CoopScheduleResponse)
  schedule: CoopScheduleResponse;

  @ApiProperty({ type: [CoopPlayerResultResponse], minItems: 4 })
  @Expose()
  @Type(() => CoopPlayerResultResponse)
  players: CoopPlayerResultResponse[];

  @ApiProperty({ type: [CoopWaveResultResponse], minItems: 3 })
  @Expose()
  @Type(() => CoopWaveResultResponse)
  waves: CoopWaveResultResponse[];
}
