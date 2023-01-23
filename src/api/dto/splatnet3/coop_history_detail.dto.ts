import { BadRequestException } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
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

export class CoopHistoryDetailRequest {
  @ApiProperty({
    description: "固有ID",
    example: "20230113T053227_0687f606-9322-4c17-b49f-558b7aab26e1",
  })
  @IsString()
  @IsNotEmpty()
  @Transform((params) => {
    const id: string = Buffer.from(params.value, "base64").toString();
    const regexp = /(\d{8}T\d{6}_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/;
    const matches: string[] | null = id.match(regexp);
    console.log(id, matches);
    if (matches === null) {
      throw new BadRequestException();
    }
    return matches[0];
  })
  id: string;

  @ApiProperty({ description: "キケン度" })
  @IsNumber()
  @Min(0)
  @Max(3.33)
  dangerRate: number;

  @ApiPropertyOptional({ description: "バイト後の称号", nullable: true, type: IntegerId })
  @IsOptional()
  @ValidateNested()
  @Type(() => IntegerId)
  afterGrade: IntegerId | null;

  @ApiProperty({ description: "0でクリア、-1で回線落ち、それ以外は失敗したWAVE" })
  @IsInt()
  @Min(-1)
  @Max(3)
  resultWave: number;

  @ApiProperty({ description: "遊んだ時間", type: Date })
  @IsDateString()
  playedTime: string;

  @ApiProperty({ description: "ルール", enum: Rule })
  @IsEnum(Rule)
  rule: Rule;

  @ApiProperty({ description: "ステージ", type: IntegerId })
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

  @ApiProperty({ description: "自身のリザルト", type: PlayerRequest })
  @ValidateNested()
  @Type(() => PlayerRequest)
  myResult: PlayerRequest;

  @ApiProperty({ description: "仲間のリザルト", type: [PlayerRequest] })
  @ValidateNested({ each: true })
  @Type(() => PlayerRequest)
  memberResults: PlayerRequest[];

  @ApiProperty({ description: "オカシラのリザルト", type: BossResult })
  @IsOptional()
  @ValidateNested()
  @Type(() => BossResult)
  bossResult: BossResult | null;

  @ApiProperty({
    description: "オオモノのリザルト",
    maxItems: 14,
    minItems: 14,
    type: [EnemyResult],
  })
  @ValidateNested({ each: true })
  @Type(() => EnemyResult)
  enemyResults: EnemyResult[];

  @ApiProperty({ description: "WAVEのリザルト", maxItems: 3, minItems: 3, type: [WaveResult] })
  @ValidateNested({ each: true })
  @Type(() => WaveResult)
  waveResults: WaveResult[];

  @ApiProperty({ description: "ブキ一覧", maxItems: 3, minItems: 3, type: [Weapon] })
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
