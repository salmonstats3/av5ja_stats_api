import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from "class-validator";

import { BossResult } from "./boss.dto";
import { EnemyResult } from "./enemy.dto";
import { PlayerRequest } from "./player.dto";
import { IntegerId, StringId } from "./rawvalue.dto";
import { WaveResult } from "./wave.dto";
import { Weapon } from "./weapon.dto";

export enum Mode {
  REGULAR = "REGULAR",
  PRIVATE_CUSTOM = "PRIVATE_CUSTOM",
  PRIVATE_SCENARIO = "PRIVATE_SCENARIO",
}

export enum Rule {
  REGULAR = "REGULAR",
  BIG_RUN = "BIG_RUN",
}

export enum Setting {
  NORMAL = "CoopNormalSetting",
  BIG_RUN = "CoopBigRunSetting",
}

class Scale {
  @ApiPropertyOptional({ description: "キンウロコ", nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(13)
  gold: number | null;

  @ApiPropertyOptional({ description: "ギンウロコ", nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(13)
  silver: number | null;

  @ApiPropertyOptional({ description: "ドウウロコ", nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(13)
  bronze: number | null;
}

export class CoopHistoryDetailRequest extends StringId {
  @ApiProperty({ description: "キケン度" })
  @IsNumber()
  @Min(0)
  @Max(3.33)
  dangerRate: number;

  @ApiPropertyOptional({ type: IntegerId, description: "バイト後の称号", nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => IntegerId)
  afterGrade: IntegerId | null;

  @ApiProperty({ description: "0でクリア、-1で回線落ち、それ以外は失敗したWAVE" })
  @IsInt()
  @Min(-1)
  @Max(3)
  resultWave: number;

  @ApiProperty({ type: Date, description: "遊んだ時間" })
  @IsDateString()
  playedTime: string;

  @ApiProperty({ enum: Rule, description: "ルール" })
  @IsEnum(Rule)
  rule: Rule;

  @ApiProperty({ type: IntegerId, description: "ステージ" })
  @ValidateNested()
  @Type(() => IntegerId)
  coopStage: IntegerId;

  @ApiPropertyOptional({
    description: "シナリオコード",
    example: "XXXX-XXXX-XXXX-XXXX",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  scenarioCode: string | null;

  @ApiProperty({ type: PlayerRequest, description: "自身のリザルト" })
  @ValidateNested()
  @Type(() => PlayerRequest)
  myResult: PlayerRequest;

  @ApiProperty({ type: [PlayerRequest], description: "仲間のリザルト" })
  @ValidateNested({ each: true })
  @Type(() => PlayerRequest)
  memberResults: PlayerRequest[];

  @ApiProperty({ type: BossResult, description: "オカシラのリザルト" })
  @IsOptional()
  @ValidateNested()
  @Type(() => BossResult)
  bossResult: BossResult | null;

  @ApiProperty({
    maxItems: 14,
    minItems: 14,
    type: [EnemyResult],
    description: "オオモノのリザルト",
  })
  @ValidateNested({ each: true })
  @Type(() => EnemyResult)
  enemyResults: EnemyResult[];

  @ApiProperty({ maxItems: 3, minItems: 3, type: [WaveResult], description: "WAVEのリザルト" })
  @ValidateNested({ each: true })
  @Type(() => WaveResult)
  waveResults: WaveResult[];

  @ApiProperty({ maxItems: 3, minItems: 3, type: [Weapon], description: "ブキ一覧" })
  @ValidateNested({ each: true })
  @Type(() => Weapon)
  weapons: Weapon[];

  @ApiPropertyOptional({ description: "バイト後の評価ポイント", nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(999)
  afterGradePoint: number | null;

  @ApiPropertyOptional({ description: "バイトポイント", nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  jobPoint: number | null;

  @ApiPropertyOptional({ description: "バイトスコア", nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  jobScore: number | null;

  @ApiPropertyOptional({ description: "バイトレート", nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(3.25)
  jobRate: number | null;

  @ApiPropertyOptional({ description: "バイトボーナス", nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  jobBonus: number | null;

  @ApiPropertyOptional({ description: "オカシラメーター", nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  smellMeter: number | null;

  @ApiProperty({ description: "ウロコ" })
  @IsOptional()
  @ValidateNested()
  @Type(() => Scale)
  scale: Scale;

  @ApiPropertyOptional({ description: "バイトID", nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => StringId)
  nextHistoryDetail: StringId | null;

  @ApiPropertyOptional({ description: "バイトID", nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => StringId)
  previousHistoryDetail: StringId | null;
}
