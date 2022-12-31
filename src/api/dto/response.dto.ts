import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";

import { Mode, Rule } from "./splatnet3/coop_history_detail.dto";
import { Species } from "./splatnet3/player.dto";

export class CoopResultCreateResponse {
  @ApiProperty({ description: "固有っぽいのに固有じゃないID", format: "uuid" })
  uuid: string;

  @ApiProperty({ description: "Salmon Stats+のID" })
  salmonId: number;

  @ApiProperty({ description: "多分固有のID" })
  id: string;

  constructor(uuid: string, salmonId: number, id: string) {
    this.uuid = uuid;
    this.salmonId = salmonId;
    this.id = id;
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
  "オカシラシャケ" = 23,
}

class CoopWaveResultResponse {
  @ApiProperty({ description: "1~4の値が入ります" })
  @Expose()
  waveId: number;

  @ApiProperty({
    enum: EventId,
    enumName: "EventId",
    type: Number,
  })
  @Expose()
  eventType: EventId;

  @ApiProperty({ enum: WaterId, enumName: "WaterId", type: Number })
  @Expose()
  waterLevel: number;

  @ApiProperty({
    description: "EX-WAVEでは常に`null`が入ります",
    nullable: true,
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
    description: "オカシラシャケを討伐できなかった場合は`false`が入ります",
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
    description: "バッジのIDが返りますがつけていない場合は`null`が入ります",
    maxItems: 3,
    minItems: 3,
    type: [Number],
  })
  @Expose()
  @Transform((param) => param.value.map((badge) => (badge === -1 ? null : badge)))
  badges: number[];

  @ApiProperty({ description: "ネームプレートのIDが入ります" })
  @Expose()
  nameplate: number;

  @ApiProperty({
    description: "RGBAが入ります",
    maxItems: 4,
    minItems: 4,
    type: [Number],
  })
  @Expose()
  textColor: number[];

  @ApiProperty({ description: "ユニフォームIDが入ります" })
  @Expose()
  uniform: number;

  @ApiProperty()
  @Expose()
  bossKillCountsTotal: number;

  @ApiProperty({
    description: "わからない場合は`null`が入ります",
    maxItems: 14,
    minItems: 14,
    type: [Number],
  })
  @Expose()
  @Transform((param) => param.value.map((count) => (count === -1 ? null : count)))
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

  @ApiProperty({ description: "コンテナに入れた金イクラの数です" })
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

  @ApiProperty({ maximum: 8, minimum: 0, nullable: true })
  @Expose()
  gradeId: number | null;

  @ApiProperty({ maximum: 999, minimum: 0, nullable: true })
  @Expose()
  gradePoint: number | null;

  @ApiProperty({
    description: "オカシラメーター",
    maximum: 5,
    minimum: 0,
    nullable: true,
  })
  @Expose()
  smellMeter: number | null;

  @ApiProperty({ enum: Species })
  @Expose()
  species: Species;

  @ApiProperty()
  @Expose()
  specialId: number;

  @ApiProperty({ maxItems: 4, minItems: 0, type: [Number] })
  @Expose()
  specialCounts: number[];

  @ApiProperty({ maxItems: 4, minItems: 0, type: [Number] })
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
  @ApiProperty({ description: "固有のID" })
  @Expose()
  salmonId: number;

  @ApiProperty({
    description: "リザルトに紐付けられたUUID",
    format: "uuid",
    type: String,
  })
  @Expose()
  uuid: string;

  @ApiProperty({ maxItems: 14, minItems: 14, type: [Number] })
  @Expose()
  bossCounts: number[];

  @ApiProperty({ maxItems: 14, minItems: 14, type: [Number] })
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

  @ApiProperty({ description: "夜イベントを含むかどうか" })
  @Expose()
  nightLess: boolean;

  @ApiProperty()
  @Expose()
  dangerRate: number;

  @ApiProperty({ type: Date })
  @Expose()
  playTime: Date;

  @ApiProperty({
    description: "WAVE3をクリアすればオカシラ失敗しても`true`が返ります",
  })
  @Expose()
  isClear: boolean;

  @ApiProperty({ description: "失敗したWAVEのidが返ります", nullable: true })
  @Expose()
  failureWave: number | null;

  @ApiProperty({
    description: "オカシラシャケを討伐できたかが返ります",
    nullable: true,
  })
  @Expose()
  isBossDefeated: boolean | null;

  @ApiProperty({ description: "オカシラシャケのIDが返ります", nullable: true })
  @Expose()
  bossId: number | null;

  @ApiProperty({ type: CoopScheduleResponse })
  @Expose()
  @Type(() => CoopScheduleResponse)
  schedule: CoopScheduleResponse;

  @ApiProperty({ minItems: 4, type: [CoopPlayerResultResponse] })
  @Expose()
  @Type(() => CoopPlayerResultResponse)
  players: CoopPlayerResultResponse[];

  @ApiProperty({ minItems: 3, type: [CoopWaveResultResponse] })
  @Expose()
  @Type(() => CoopWaveResultResponse)
  waves: CoopWaveResultResponse[];
}
