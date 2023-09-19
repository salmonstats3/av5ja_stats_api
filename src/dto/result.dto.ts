import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Rule, Species } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import dayjs from 'dayjs';
import { CoopEnemyInfoId } from 'src/utils/enum/coop_enemy_id';
import { CoopGradeId } from 'src/utils/enum/coop_grade_id';
import { CoopSkinId } from 'src/utils/enum/coop_skin_id';
import { WeaponInfoSpecialId } from 'src/utils/enum/weapon_info_special';
import { CoopPlayerId } from 'src/utils/player_id';
import { CoopHistoryDetailId } from 'src/utils/result_id';

import { CoopStage, MainWeapon } from './schedule.dto';

class AfterGrade {
  @ApiProperty({
    description: 'Base64 Encoded string. For example `Q29vcEdyYWRlLTg=` means `CoopGrade-8`.',
    example: 'Q29vcEdyYWRlLTg=',
    required: true,
    type: 'string',
  })
  @IsEnum(CoopGradeId)
  @Expose()
  @Transform(({ value }) => {
    const regexp = /-([0-9-]*)/;
    const match = regexp.exec(atob(value));
    return match === null ? CoopGradeId.Grade00 : parseInt(match[1], 10);
  })
  readonly id: number;
}

class Scale {
  @ApiProperty({ required: true, type: 'integer' })
  @IsInt()
  @Min(0)
  @Max(13)
  @Expose()
  readonly gold: number;

  @ApiProperty({ required: true, type: 'integer' })
  @IsInt()
  @Min(0)
  @Max(13)
  @Expose()
  readonly bronze: number;

  @ApiProperty({ required: true, type: 'integer' })
  @IsInt()
  @Min(0)
  @Max(13)
  @Expose()
  readonly silver: number;
}

class WaveResult {}

class CoopEnemy {
  @ApiProperty({ example: 'Q29vcEVuZW15LTQ=', required: true, type: 'string' })
  @IsEnum(CoopEnemyInfoId)
  @Expose()
  @Transform(({ value }) => {
    const regexp = /-([0-9-]*)/;
    const match = regexp.exec(atob(value));
    if (match === null) {
      throw new BadRequestException(`Invalid CoopEnemyInfoId: ${value}`);
    }
    return parseInt(match[1], 10);
  })
  id: CoopEnemyInfoId;
}

class EnemyResult {
  @ApiProperty({ minimum: 0, required: true, type: 'integer' })
  @IsInt()
  @Min(0)
  @Expose()
  defeatCount: number;

  @ApiProperty({ minimum: 0, required: true, type: 'integer' })
  @IsInt()
  @Min(0)
  @Expose()
  teamDefeatCount: number;

  @ApiProperty({ minimum: 1, required: true, type: 'integer' })
  @IsInt()
  @Min(1)
  @Expose()
  popCount: number;

  @ApiProperty({ required: true, type: CoopEnemy })
  @Type(() => CoopEnemy)
  @Expose()
  @ValidateNested()
  enemy: CoopEnemy;
}

class BossResult {}

class SpecialWeapon {
  @ApiProperty({ enum: WeaponInfoSpecialId, name: 'weaponId', required: true })
  @IsEnum(WeaponInfoSpecialId)
  @Expose({ name: 'weaponId' })
  id: WeaponInfoSpecialId;
}

class TextColor {
  @ApiProperty({ maximum: 1, minimum: 0, required: true, type: Number })
  @IsNumber()
  @Expose()
  @Min(0)
  @Max(1)
  a: number;

  @ApiProperty({ maximum: 1, minimum: 0, required: true, type: Number })
  @IsNumber()
  @Expose()
  @Min(0)
  @Max(1)
  b: number;

  @ApiProperty({ maximum: 1, minimum: 0, required: true, type: Number })
  @IsNumber()
  @Expose()
  @Min(0)
  @Max(1)
  g: number;

  @ApiProperty({ maximum: 1, minimum: 0, required: true, type: Number })
  @IsNumber()
  @Expose()
  @Min(0)
  @Max(1)
  r: number;
}

class Background {
  @ApiProperty({ required: true, type: TextColor })
  @Expose()
  @Type(() => TextColor)
  @ValidateNested()
  textColor: TextColor;

  @ApiProperty({ example: 'TmFtZXBsYXRlQmFja2dyb3VuZC0x', required: true, type: 'string' })
  @IsInt()
  @Expose()
  @Transform(({ value }) => {
    const regexp = /-([0-9-]*)/;
    const match = regexp.exec(atob(value));
    return match === null ? 1 : parseInt(match[1], 10);
  })
  id: number;
}

class NamePlate {
  @ApiProperty({ isArray: true, required: true, type: 'integer' })
  @IsArray()
  @Min(3)
  @Max(3)
  @Expose()
  readonly badges: (number | null)[];

  @ApiProperty({ required: true, type: Background })
  @Expose()
  @Type(() => Background)
  @ValidateNested()
  background: Background;
}

class Uniform {
  @ApiProperty({ example: 'Q29vcFVuaWZvcm0tMQ==', required: true, type: 'string' })
  @Expose()
  @IsEnum(CoopSkinId)
  @Transform(({ value }) => {
    const regexp = /-([0-9-]*)/;
    const match = regexp.exec(atob(value));
    return match === null ? CoopSkinId.COP001 : parseInt(match[1], 10);
  })
  id: number;
}

class PlayerResult {
  @ApiProperty({ required: true, type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  byname: string;

  @ApiProperty({ required: true, type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty({ required: true, type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  nameId: string;

  @ApiProperty({ required: true, type: NamePlate })
  @Type(() => NamePlate)
  @ValidateNested()
  nameplate: NamePlate;

  @ApiProperty({ required: true, type: Uniform })
  @Type(() => Uniform)
  @ValidateNested()
  uniform: Uniform;

  @ApiProperty({ required: true, type: 'string' })
  @Expose()
  @Type(() => CoopPlayerId)
  @Transform(({ value }) => new CoopPlayerId(value))
  id: string;

  @ApiProperty({ enum: Species, required: true })
  @IsEnum(Species)
  @Expose()
  species: Species;
}

class MemberResult {
  @ApiProperty({ required: true, type: PlayerResult })
  @Expose()
  @Type(() => PlayerResult)
  @ValidateNested()
  player: PlayerResult;

  @ApiProperty({ isArray: true, required: true, type: MainWeapon })
  @Expose()
  @Type(() => MainWeapon)
  @ValidateNested({ each: true })
  weapons: MainWeapon[];

  @ApiProperty({ required: true })
  @Expose()
  @Type(() => SpecialWeapon)
  @ValidateNested()
  specialWeapon: SpecialWeapon;

  @ApiProperty({ minimum: 0, required: true, type: 'integer' })
  @IsInt()
  @Min(0)
  @Expose()
  readonly defeatEnemyCount: number;

  @ApiProperty({ minimum: 0, required: true, type: 'integer' })
  @IsInt()
  @Min(0)
  @Expose()
  readonly deliverCount: number;

  @ApiProperty({ minimum: 0, required: true, type: 'integer' })
  @IsInt()
  @Min(0)
  @Expose()
  readonly goldenAssistCount: number;

  @ApiProperty({ minimum: 0, required: true, type: 'integer' })
  @IsInt()
  @Min(0)
  @Expose()
  readonly goldenDeliverCount: number;

  @ApiProperty({ minimum: 0, required: true, type: 'integer' })
  @IsInt()
  @Min(0)
  @Expose()
  readonly rescueCount: number;

  @ApiProperty({ minimum: 0, required: true, type: 'integer' })
  @IsInt()
  @Min(0)
  @Expose()
  readonly rescuedCount: number;
}

class CoopHistoryDetail {
  @ApiProperty({ required: true, type: 'string' })
  @Expose()
  @Type(() => CoopHistoryDetailId)
  @Transform(({ value }) => new CoopHistoryDetailId(value))
  id: CoopHistoryDetailId;

  @ApiProperty({ required: true, type: AfterGrade })
  @Expose()
  afterGrade: AfterGrade;

  @ApiProperty()
  @Expose()
  @Type(() => MemberResult)
  @ValidateNested()
  myResult: MemberResult;

  @ApiProperty({ isArray: true, maxItems: 3, minItems: 1, required: true, type: MemberResult })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(3)
  @Expose()
  @Type(() => MemberResult)
  @ValidateNested({ each: true })
  memberResults: MemberResult[];

  @ApiProperty({ required: true, type: BossResult })
  @IsOptional()
  @Expose()
  @Type(() => BossResult)
  @ValidateNested()
  bossResult: BossResult | null;

  @ApiProperty({ isArray: true, maxItems: 14, minItems: 1, required: true, type: EnemyResult })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(14)
  @Expose()
  @Type(() => EnemyResult)
  @ValidateNested({ each: true })
  enemyResults: EnemyResult[];

  @ApiProperty({ isArray: true, maxItems: 5, minItems: 1, required: true, type: WaveResult })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @Expose()
  @Type(() => WaveResult)
  @ValidateNested({ each: true })
  waveResults: WaveResult[];

  @ApiProperty({ maximum: 5, minimum: -1, required: true, type: 'integer' })
  @IsInt()
  @Min(-1)
  @Max(5)
  @Expose()
  resultWave: number;

  @ApiProperty({ required: true, type: Date })
  @IsDate()
  @Transform(({ value }) => dayjs(value).toDate())
  @Expose()
  playedTime: Date;

  @ApiProperty({ enum: Rule, required: true })
  @IsEnum(Rule)
  @Expose()
  rule: Rule;

  @ApiProperty({ required: true, type: CoopStage })
  @Expose()
  @Type(() => CoopStage)
  @ValidateNested()
  coopStage: CoopStage;

  @ApiProperty({ maximum: 3.33, minimum: 0, required: true, type: 'number' })
  @Min(0)
  @Max(3.33)
  @Expose()
  dangerRate: number;

  @ApiProperty({ nullable: true, required: true, type: 'string' })
  @Expose()
  scenarioCode: string | null;

  @ApiProperty({ maximum: 5, minimum: 0, nullable: true, required: true, type: 'integer' })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(5)
  @Expose()
  smellMeter: number | null;

  @ApiProperty({ isArray: true, maxItems: 4, minItems: 1, required: true, type: MainWeapon })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @Type(() => MainWeapon)
  @Expose()
  @ValidateNested({ each: true })
  weapons: MainWeapon[];

  @ApiProperty({ maximum: 999, minimum: 0, nullable: true, required: true, type: 'integer' })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(999)
  @Expose()
  afterGradePoint: number | null;

  @ApiProperty({ nullable: true, required: true, type: Scale })
  @Type(() => Scale)
  @IsOptional()
  @Expose()
  @ValidateNested()
  scale: Scale | null;

  @ApiProperty({ minimum: 0, nullable: true, required: true, type: 'integer' })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Expose()
  jobPoint: number | null;

  @ApiProperty({ minimum: 0, nullable: true, required: true, type: 'integer' })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Expose()
  jobScore: number | null;

  @ApiProperty({ minimum: 0, nullable: true, required: true, type: Number })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Expose()
  jobRate: number | null;

  @ApiProperty({ minimum: 0, nullable: true, required: true, type: 'integer' })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Expose()
  jobBonus: number | null;
}

class CoopResultDataClass {
  @ApiProperty({ required: true, type: CoopHistoryDetail })
  @Expose()
  @Type(() => CoopHistoryDetail)
  @ValidateNested()
  readonly coopHistoryDetail: CoopHistoryDetail;
}

export class ResultCreateDto {
  @ApiProperty({ required: true, type: CoopResultDataClass })
  @Expose()
  @Type(() => CoopResultDataClass)
  @ValidateNested()
  readonly data: CoopResultDataClass;
}
