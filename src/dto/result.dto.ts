import { createHash } from 'crypto';

import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Mode, Prisma, Rule, Species } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
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
import { CoopBossInfoId, CoopEnemyInfoId } from 'src/utils/enum/coop_enemy_id';
import { CoopGradeId } from 'src/utils/enum/coop_grade_id';
import { CoopSkinId } from 'src/utils/enum/coop_skin_id';
import { EventId } from 'src/utils/enum/event_wave';
import { WaterLevelId } from 'src/utils/enum/water_level';
import { WeaponInfoSpecialId } from 'src/utils/enum/weapon_info_special';
import { CoopPlayerId } from 'src/utils/player_id';
import { CoopHistoryDetailId } from 'src/utils/result_id';

import { CoopStage, MainWeapon } from './schedule.dto';

class SpecialWeapon {
  @ApiProperty({ enum: WeaponInfoSpecialId, name: 'weaponId', required: true })
  @IsEnum(WeaponInfoSpecialId)
  @Expose({ name: 'weaponId' })
  readonly id: WeaponInfoSpecialId;
}

class SpecialWeaponUsage {
  @ApiProperty({ enum: WeaponInfoSpecialId, name: 'id', required: true })
  @IsEnum(WeaponInfoSpecialId)
  @Expose({ name: 'id' })
  @Transform(({ value }) => {
    const regexp = /-([0-9-]*)/;
    const match = regexp.exec(atob(value));
    return match === null ? CoopGradeId.Grade00 : parseInt(match[1], 10);
  })
  readonly id: WeaponInfoSpecialId;
}

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
  readonly id: CoopGradeId;
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

class EventWave {
  @ApiProperty({ required: true, type: 'string' })
  @IsEnum(EventId)
  @Expose()
  @Transform(({ value }) => {
    const regexp = /-([0-9-]*)/;
    const match = regexp.exec(atob(value));
    return match === null ? CoopGradeId.Grade00 : parseInt(match[1], 10);
  })
  readonly id: EventId;
}

class WaveResult {
  @ApiProperty({ enum: WaterLevelId, required: true })
  @IsEnum(WaterLevelId)
  @Expose()
  readonly waterLevel: WaterLevelId;

  @ApiProperty({ required: true, type: EventWave })
  @Expose()
  @IsOptional()
  @Type(() => EventWave)
  @ValidateNested()
  readonly eventWave: EventWave | null;

  @ApiProperty({ minimum: 0, nullable: true, required: true, type: 'integer' })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Expose()
  readonly deliverNorm: number | null;

  @ApiProperty({ minimum: 0, required: true, type: 'integer' })
  @IsInt()
  @Min(0)
  @Expose()
  readonly goldenPopCount: number;

  @ApiProperty({ minimum: 0, nullable: true, required: true, type: 'integer' })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Expose()
  readonly teamDeliverCount: number | null;

  @ApiProperty({ isArray: true, maximum: 8, minimum: 0, nullable: false, required: true, type: SpecialWeaponUsage })
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(8)
  @Expose()
  @Type(() => SpecialWeaponUsage)
  @ValidateNested({ each: true })
  readonly specialWeapons: SpecialWeaponUsage[];

  @ApiProperty({ minimum: 0, required: true, type: 'integer' })
  @IsInt()
  @Min(0)
  @Expose()
  readonly waveNumber: number;

  create(resultWave: number, hasDefeatBoss: boolean | null): Prisma.WaveCreateManyResultInput {
    /**
     * オカシラが出現していない
     * - resultWaveの値と一致するWAVEだけ失敗
     * オカシラが出現している
     * - ノルマが存在するWAVEは常に成功、ノルマがない(Ex-WAVE)はhasDefeatBossの値と一致
     */
    return {
      eventType: this.eventWave === null ? 0 : this.eventWave.id,
      goldenIkuraNum: this.teamDeliverCount,
      goldenIkuraPopNum: this.goldenPopCount,
      isClear: hasDefeatBoss === null ? this.waveNumber !== resultWave : this.deliverNorm === null ? hasDefeatBoss : true,
      quotaNum: this.deliverNorm,
      waterLevel: this.waterLevel,
      waveId: this.waveNumber,
    };
  }
}

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
  readonly id: CoopEnemyInfoId;
}

class EnemyResult {
  @ApiProperty({ minimum: 0, required: true, type: 'integer' })
  @IsInt()
  @Min(0)
  @Expose()
  readonly defeatCount: number;

  @ApiProperty({ minimum: 0, required: true, type: 'integer' })
  @IsInt()
  @Min(0)
  @Expose()
  readonly teamDefeatCount: number;

  @ApiProperty({ minimum: 1, required: true, type: 'integer' })
  @IsInt()
  @Min(1)
  @Expose()
  readonly popCount: number;

  @ApiProperty({ required: true, type: CoopEnemy })
  @Type(() => CoopEnemy)
  @Expose()
  @ValidateNested()
  readonly enemy: CoopEnemy;
}

class KingSalmonId {
  @ApiProperty({ example: 'Q29vcEVuZW15LTIz', required: true, type: 'string' })
  @IsEnum(CoopBossInfoId)
  @Expose()
  @Transform(({ value }) => {
    const regexp = /-([0-9-]*)/;
    const match = regexp.exec(atob(value));
    if (match === null) {
      throw new BadRequestException(`Invalid CoopEnemyInfoId: ${value}`);
    }
    return parseInt(match[1], 10);
  })
  id: CoopBossInfoId;
}

class BossResult {
  @ApiProperty({ required: true, type: 'boolean' })
  @Expose()
  @IsBoolean()
  hasDefeatBoss: boolean;

  @ApiProperty({ required: true, type: KingSalmonId })
  @Type(() => KingSalmonId)
  @Expose()
  @ValidateNested()
  boss: KingSalmonId;
}

class TextColor {
  @ApiProperty({ maximum: 1, minimum: 0, required: true, type: Number })
  @IsNumber()
  @Expose()
  @Min(0)
  @Max(1)
  readonly a: number;

  @ApiProperty({ maximum: 1, minimum: 0, required: true, type: Number })
  @IsNumber()
  @Expose()
  @Min(0)
  @Max(1)
  readonly b: number;

  @ApiProperty({ maximum: 1, minimum: 0, required: true, type: Number })
  @IsNumber()
  @Expose()
  @Min(0)
  @Max(1)
  readonly g: number;

  @ApiProperty({ maximum: 1, minimum: 0, required: true, type: Number })
  @IsNumber()
  @Expose()
  @Min(0)
  @Max(1)
  readonly r: number;
}

class Background {
  @ApiProperty({ required: true, type: TextColor })
  @Expose()
  @Type(() => TextColor)
  @ValidateNested()
  readonly textColor: TextColor;

  @ApiProperty({ example: 'TmFtZXBsYXRlQmFja2dyb3VuZC0x', required: true, type: 'string' })
  @IsInt()
  @Expose()
  @Transform(({ value }) => {
    const regexp = /-([0-9-]*)/;
    const match = regexp.exec(atob(value));
    return match === null ? 1 : parseInt(match[1], 10);
  })
  readonly id: number;
}

class Badge {
  @ApiProperty({ required: true, type: 'string' })
  @IsInt()
  @Expose()
  @Transform(({ value }) => {
    const regexp = /-([0-9-]*)/;
    const match = regexp.exec(atob(value));
    return match === null ? 1 : parseInt(match[1], 10);
  })
  readonly id: number;
}

class NamePlate {
  @ApiProperty({ isArray: true, required: true, type: Badge })
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @Expose()
  @Type(() => Badge)
  readonly badges: (Badge | null)[];

  @ApiProperty({ required: true, type: Background })
  @Expose()
  @Type(() => Background)
  @ValidateNested()
  readonly background: Background;
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
  readonly id: number;
}

class PlayerResult {
  @ApiProperty({ required: true, type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly byname: string;

  @ApiProperty({ required: true, type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly name: string;

  @ApiProperty({ required: true, type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly nameId: string;

  @ApiProperty({ required: true, type: NamePlate })
  @Type(() => NamePlate)
  @Expose()
  @ValidateNested()
  readonly nameplate: NamePlate;

  @ApiProperty({ required: true, type: Uniform })
  @Type(() => Uniform)
  @ValidateNested()
  @Expose()
  readonly uniform: Uniform;

  @ApiProperty({ required: true, type: 'string' })
  @Expose()
  @Type(() => CoopPlayerId)
  @Transform(({ value }) => new CoopPlayerId(value))
  readonly id: CoopPlayerId;

  @ApiProperty({ enum: Species, required: true })
  @IsEnum(Species)
  @Expose()
  readonly species: Species;
}

class MemberResult {
  @ApiProperty({ required: true, type: PlayerResult })
  @Expose()
  @Type(() => PlayerResult)
  @ValidateNested()
  readonly player: PlayerResult;

  @ApiProperty({ isArray: true, required: true, type: MainWeapon })
  @Expose()
  @Type(() => MainWeapon)
  @ValidateNested({ each: true })
  readonly weapons: MainWeapon[];

  @ApiProperty({ required: true })
  @Expose()
  @Type(() => SpecialWeapon)
  @ValidateNested()
  readonly specialWeapon: SpecialWeapon;

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

  private get weaponList(): number[] {
    return this.weapons.map((weapon) => weapon.image.id);
  }

  get badges(): number[] {
    return this.player.nameplate.badges.map((badge) => (badge === null ? -1 : badge.id));
  }

  private get textColor(): number[] {
    return [
      this.player.nameplate.background.textColor.r,
      this.player.nameplate.background.textColor.g,
      this.player.nameplate.background.textColor.b,
      this.player.nameplate.background.textColor.a,
    ];
  }

  create(
    gradeId: number | null,
    gradePoint: number | null,
    jobBonus: number | null,
    jobRate: number | null,
    jobScore: number | null,
    kumaPoint: number | null,
    smellMeter: number | null,
    bossKillCounts: number[],
    waves: WaveResult[],
  ): Prisma.PlayerCreateManyResultInput {
    const isMyself: boolean = this.player.id.isMyself;
    const specialCounts: number[] = waves.map((wave) => wave.specialWeapons.filter((weapon) => weapon.id === this.specialWeapon.id).length);
    return {
      badges: this.badges,
      bossKillCounts: isMyself
        ? bossKillCounts
        : Object.values(CoopEnemyInfoId)
            .filter((v) => !isNaN(v as CoopEnemyInfoId))
            .map(() => -1),
      bossKillCountsTotal: this.defeatEnemyCount,
      byname: this.player.byname,
      deadCount: this.rescuedCount,
      goldenIkuraAssistNum: this.goldenAssistCount,
      goldenIkuraNum: this.goldenDeliverCount,
      gradeId: isMyself ? gradeId : null,
      gradePoint: isMyself ? gradePoint : null,
      helpCount: this.rescueCount,
      ikuraNum: this.deliverCount,
      jobBonus: isMyself ? jobBonus : null,
      jobRate: isMyself ? jobRate : null,
      jobScore: isMyself ? jobScore : null,
      kumaPoint: isMyself ? kumaPoint : null,
      name: this.player.name,
      nameId: this.player.nameId,
      nameplate: this.player.nameplate.background.id,
      nplnUserId: this.player.id.nplnUserId,
      smellMeter: isMyself ? smellMeter : null,
      specialCounts: specialCounts,
      specialId: this.specialWeapon.id,
      species: this.player.species,
      textColor: this.textColor,
      uniform: this.player.uniform.id,
      weaponList: this.weaponList,
    };
  }
}

class CoopHistoryDetail {
  @ApiProperty({ required: true, type: 'string' })
  @Expose()
  @Type(() => CoopHistoryDetailId)
  @Transform(({ value }) => new CoopHistoryDetailId(value))
  readonly id: CoopHistoryDetailId;

  @ApiProperty({ required: true, type: AfterGrade })
  @Expose()
  @Type(() => AfterGrade)
  @ValidateNested()
  readonly afterGrade: AfterGrade;

  @ApiProperty()
  @Expose()
  @Type(() => MemberResult)
  @ValidateNested()
  readonly myResult: MemberResult;

  @ApiProperty({ isArray: true, maxItems: 3, minItems: 1, required: true, type: MemberResult })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(3)
  @Expose()
  @Type(() => MemberResult)
  @ValidateNested({ each: true })
  readonly memberResults: MemberResult[];

  @ApiProperty({ nullable: true, required: true, type: BossResult })
  @IsOptional()
  @Expose()
  @Type(() => BossResult)
  @ValidateNested()
  readonly bossResult: BossResult | null;

  @ApiProperty({ isArray: true, maxItems: 14, minItems: 1, required: true, type: EnemyResult })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(14)
  @Expose()
  @Type(() => EnemyResult)
  @ValidateNested({ each: true })
  readonly enemyResults: EnemyResult[];

  @ApiProperty({ isArray: true, maxItems: 5, minItems: 1, required: true, type: WaveResult })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @Expose()
  @Type(() => WaveResult)
  @ValidateNested({ each: true })
  readonly waveResults: WaveResult[];

  @ApiProperty({ maximum: 5, minimum: -1, required: true, type: 'integer' })
  @IsInt()
  @Min(-1)
  @Max(5)
  @Expose()
  readonly resultWave: number;

  @ApiProperty({ required: true, type: Date })
  @IsDate()
  @Transform(({ value }) => dayjs(value).toDate())
  @Expose()
  readonly playedTime: Date;

  @ApiProperty({ enum: Rule, required: true })
  @IsEnum(Rule)
  @Expose()
  readonly rule: Rule;

  @ApiProperty({ required: true, type: CoopStage })
  @Expose()
  @Type(() => CoopStage)
  @ValidateNested()
  readonly coopStage: CoopStage;

  @ApiProperty({ maximum: 3.33, minimum: 0, required: true, type: 'number' })
  @Min(0)
  @Max(3.33)
  @Expose()
  readonly dangerRate: number;

  @ApiProperty({ nullable: true, required: true, type: 'string' })
  @IsString()
  @IsOptional()
  @Expose()
  readonly scenarioCode: string | null;

  @ApiProperty({ maximum: 5, minimum: 0, nullable: true, required: true, type: 'integer' })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(5)
  @Expose()
  readonly smellMeter: number | null;

  @ApiProperty({ isArray: true, maxItems: 4, minItems: 1, required: true, type: MainWeapon })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @Type(() => MainWeapon)
  @Expose()
  @ValidateNested({ each: true })
  readonly weapons: MainWeapon[];

  @ApiProperty({ maximum: 999, minimum: 0, nullable: true, required: true, type: 'integer' })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(999)
  @Expose()
  readonly afterGradePoint: number | null;

  @ApiProperty({ nullable: true, required: true, type: Scale })
  @Type(() => Scale)
  @Expose()
  @ValidateNested()
  readonly scale: Scale;

  @ApiProperty({ minimum: 0, nullable: true, required: true, type: 'integer' })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Expose()
  readonly jobPoint: number | null;

  @ApiProperty({ minimum: 0, nullable: true, required: true, type: 'integer' })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Expose()
  readonly jobScore: number | null;

  @ApiProperty({ minimum: 0, nullable: true, required: true, type: Number })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Expose()
  readonly jobRate: number | null;

  @ApiProperty({ minimum: 0, nullable: true, required: true, type: 'integer' })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Expose()
  readonly jobBonus: number | null;

  get mode(): Mode {
    switch (this.rule) {
      case Rule.REGULAR:
        return this.scenarioCode !== null ? Mode.PRIVATE_SCENARIO : this.smellMeter === null ? Mode.PRIVATE_CUSTOM : Mode.REGULAR;
      case Rule.BIG_RUN:
        return Mode.REGULAR;
      case Rule.TEAM_CONTEST:
        return Mode.LIMITED;
    }
  }

  get resultId(): string {
    return createHash('sha256')
      .update(`${this.id.uuid}-${dayjs(this.id.playTime).unix()}`)
      .digest('hex');
  }

  get weaponList(): number[] {
    return this.weapons.map((weapon) => weapon.image.id);
  }
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

  get result(): CoopHistoryDetail {
    return this.data.coopHistoryDetail;
  }

  private get players(): MemberResult[] {
    return [this.result.myResult].concat(this.result.memberResults);
  }

  private get members(): string[] {
    return this.players.map((player) => player.player.id.nplnUserId);
  }

  private get ikuraNum(): number {
    return this.players.map((player) => player.deliverCount).reduce((a, b) => a + b);
  }

  private get goldenIkuraNum(): number {
    return this.result.waveResults.map((wave) => wave.teamDeliverCount ?? 0).reduce((a, b) => a + b);
  }

  private get goldenIkuraAssistNum(): number {
    return this.players.map((player) => player.goldenAssistCount).reduce((a, b) => a + b);
  }

  private get failureWave(): number | null {
    return this.result.resultWave === 0 ? null : this.result.resultWave;
  }

  private get isBossDefeated(): boolean | null {
    return this.result.bossResult === null ? null : this.result.bossResult.hasDefeatBoss;
  }

  private get bossId(): number | null {
    return this.result.bossResult === null ? null : this.result.bossResult.boss.id;
  }

  private get nightLess(): boolean {
    return this.result.waveResults.every((wave) => wave.eventWave.id === 0);
  }

  private get isClear(): boolean {
    return this.result.resultWave === 0;
  }

  private get enemyPopCounts(): number[] {
    return Object.values(CoopEnemyInfoId)
      .filter((id) => !isNaN(id as number))
      .map((id) => this.result.enemyResults.find((enemy) => enemy.enemy.id === id)?.popCount ?? 0);
  }

  private get enemyDefeatCounts(): number[] {
    return Object.values(CoopEnemyInfoId)
      .filter((id) => !isNaN(id as number))
      .map((id) => this.result.enemyResults.find((enemy) => enemy.enemy.id === id)?.defeatCount ?? 0);
  }

  private get enemyTeamDefeatCounts(): number[] {
    return Object.values(CoopEnemyInfoId)
      .filter((id) => !isNaN(id as number))
      .map((id) => this.result.enemyResults.find((enemy) => enemy.enemy.id === id)?.teamDefeatCount ?? 0);
  }

  private create(startTime: Date, endTime: Date): Prisma.ResultCreateInput {
    const scheduleId: string = createHash('sha256')
      .update(
        `${this.result.mode}-${this.result.rule}-${this.result.coopStage.id}-${dayjs(startTime).unix()}-${dayjs(
          endTime,
        ).unix()}-${this.result.weaponList.join(',')}`,
      )
      .digest('hex');
    return {
      bossCounts: this.enemyPopCounts,
      bossId: this.bossId,
      bossKillCounts: this.enemyTeamDefeatCounts,
      bronze: this.result.scale?.bronze ?? null,
      dangerRate: this.result.dangerRate,
      failureWave: this.failureWave,
      gold: this.result.scale?.gold ?? null,
      goldenIkuraAssistNum: this.goldenIkuraAssistNum,
      goldenIkuraNum: this.goldenIkuraNum,
      ikuraNum: this.ikuraNum,
      isBossDefeated: this.isBossDefeated,
      isClear: this.isClear,
      members: this.members,
      nightLess: this.nightLess,
      playTime: this.result.id.playTime,
      players: {
        createMany: {
          data: this.players.map((player) =>
            player.create(
              this.result.afterGrade.id,
              this.result.afterGradePoint,
              this.result.jobBonus,
              this.result.jobRate,
              this.result.jobScore,
              this.result.jobPoint,
              this.result.smellMeter,
              this.enemyDefeatCounts,
              this.result.waveResults,
            ),
          ),
          skipDuplicates: true,
        },
      },
      resultId: this.result.resultId,
      scenarioCode: this.result.scenarioCode,
      schedule: {
        connectOrCreate: {
          create: {
            endTime: endTime,
            mode: this.result.mode,
            rule: this.result.rule,
            scheduleId: scheduleId,
            stageId: this.result.coopStage.id,
            startTime: startTime,
            weaponList: this.result.weaponList,
          },
          where: {
            scheduleId: scheduleId,
          },
        },
      },
      silver: this.result.scale?.silver ?? null,
      uuid: this.result.id.uuid,
      waves: {
        createMany: {
          data: this.result.waveResults.map((wave) => wave.create(this.result.resultWave, this.isBossDefeated)),
          skipDuplicates: true,
        },
      },
    };
  }

  private get update(): Prisma.ResultUpdateInput {
    return {
      players: {
        update: {
          data: {
            bossKillCounts: this.enemyDefeatCounts,
            gradeId: this.result.afterGrade.id,
            gradePoint: this.result.afterGradePoint,
            jobBonus: this.result.jobBonus,
            jobRate: this.result.jobRate,
            jobScore: this.result.jobScore,
            kumaPoint: this.result.jobPoint,
            smellMeter: this.result.smellMeter,
          },
          where: {
            nplnUserId_playTime_uuid: {
              nplnUserId: this.result.myResult.player.id.nplnUserId,
              playTime: this.result.id.playTime,
              uuid: this.result.id.uuid,
            },
          },
        },
      },
    };
  }

  upsert(startTime: Date, endTime: Date): Prisma.ResultUpsertArgs {
    return {
      create: this.create(startTime, endTime),
      select: {
        resultId: true,
        scheduleId: true,
      },
      update: this.update,
      where: {
        resultId: this.result.resultId,
      },
    };
  }
}

export class ResultCreateRequest {
  @ApiProperty({ isArray: true, maxItems: 50, minItems: 1, required: true, type: ResultCreateDto })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(50)
  @Type(() => ResultCreateDto)
  @ValidateNested({ each: true })
  @Expose()
  results: ResultCreateDto[];
}
