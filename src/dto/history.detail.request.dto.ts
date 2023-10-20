import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Mode, Rule, Species } from '@prisma/client';
import { Expose, Transform, Type, plainToInstance } from 'class-transformer';
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
import { CoopStageId } from 'src/utils/enum/coop_stage_id';
import { EventId } from 'src/utils/enum/event_wave';
import { WaterLevelId } from 'src/utils/enum/water_level';
import { WeaponInfoMain } from 'src/utils/enum/weapon_info_main';
import { WeaponInfoSpecial } from 'src/utils/enum/weapon_info_special';

import { Common } from './common.dto';
import { MainWeapon, StageScheduleQuery } from './schedule.dto';

/**
 * CoopHistoryDetailQuery -> CoopHistoryDetailQuery
 */
export namespace CoopHistoryDetailQuery {
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

  class SpecialWeapon {
    @ApiProperty({ enum: WeaponInfoSpecial.Id, name: 'weaponId', required: true })
    @IsEnum(WeaponInfoSpecial.Id)
    @Expose({ name: 'weaponId' })
    readonly id: WeaponInfoSpecial.Id;
  }

  class SpecialWeaponUsage {
    @ApiProperty({ enum: WeaponInfoSpecial.Id, name: 'id', required: true })
    @IsEnum(WeaponInfoSpecial.Id)
    @Expose({ name: 'id' })
    @Transform(({ value }) => {
      const regexp = /-([0-9-]*)/;
      const match = regexp.exec(atob(value));
      return match === null ? CoopGradeId.Grade00 : parseInt(match[1], 10);
    })
    readonly id: WeaponInfoSpecial.Id;
  }

  class AfterGrade {
    @ApiProperty({
      description: 'Base64 Encoded string. For example `Q29vcEdyYWRlLTg=` means `CoopGrade-8`.',
      example: 'Q29vcEdyYWRlLTg=',
      nullable: true,
      required: true,
      type: 'string',
    })
    @IsEnum(CoopGradeId)
    @IsOptional()
    @Expose()
    @Transform(({ value }) => {
      const regexp = /-([0-9-]*)/;
      const match = regexp.exec(atob(value));
      return match === null ? null : parseInt(match[1], 10);
    })
    readonly id: CoopGradeId | null;
  }

  class Scale {
    @ApiProperty({ nullable: true, required: true, type: 'integer' })
    @IsInt()
    @IsOptional()
    @Min(0)
    @Max(26)
    @Expose()
    readonly gold: number;

    @ApiProperty({ nullable: true, required: true, type: 'integer' })
    @IsInt()
    @IsOptional()
    @Min(0)
    @Max(26)
    @Expose()
    readonly bronze: number;

    @ApiProperty({ nullable: true, required: true, type: 'integer' })
    @IsInt()
    @IsOptional()
    @Min(0)
    @Max(26)
    @Expose()
    readonly silver: number;

    static from(gold: number | null, silver: number | null, bronze: number | null) {
      return plainToInstance(Scale, {
        bronze,
        gold,
        silver,
      });
    }
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

  export class TextColor {
    @ApiProperty({ maximum: 1, minimum: 0, required: true, type: Number })
    @IsNumber()
    @Min(0)
    @Max(1)
    @Expose()
    readonly a: number;

    @ApiProperty({ maximum: 1, minimum: 0, required: true, type: Number })
    @IsNumber()
    @Min(0)
    @Max(1)
    @Expose()
    readonly b: number;

    @ApiProperty({ maximum: 1, minimum: 0, required: true, type: Number })
    @IsNumber()
    @Min(0)
    @Max(1)
    @Expose()
    readonly g: number;

    @ApiProperty({ maximum: 1, minimum: 0, required: true, type: Number })
    @IsNumber()
    @Min(0)
    @Max(1)
    @Expose()
    readonly r: number;
  }

  export class Background {
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

  class BossResult {
    @ApiProperty({ required: true, type: 'boolean' })
    @IsBoolean()
    @Expose()
    hasDefeatBoss: boolean;

    @ApiProperty({ required: true, type: KingSalmonId })
    @Type(() => KingSalmonId)
    @Expose()
    @ValidateNested()
    boss: KingSalmonId;
  }

  export class WaveResult {
    @ApiProperty({ enum: WaterLevelId, required: true })
    @IsEnum(WaterLevelId)
    @Expose()
    readonly waterLevel: WaterLevelId;

    @ApiProperty({ nullable: true, required: true, type: EventWave })
    @Expose()
    @IsOptional()
    @Type(() => EventWave)
    @ValidateNested()
    readonly eventWave: EventWave | null;

    @ApiProperty({ minimum: 0, nullable: true, required: true, type: 'integer' })
    @IsInt()
    @IsOptional()
    @Min(0)
    @Expose({ name: 'deliverNorm' })
    readonly quotaNum: number | null;

    @ApiProperty({ minimum: 0, required: true, type: 'integer' })
    @IsInt()
    @Min(0)
    @Expose({ name: 'goldenPopCount' })
    readonly goldenIkuraPopNum: number;

    @ApiProperty({ minimum: 0, nullable: true, required: true, type: 'integer' })
    @IsInt()
    @IsOptional()
    @Min(0)
    @Expose({ name: 'teamDeliverCount' })
    readonly goldenIkuraNum: number | null;

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
    @Max(5)
    @Expose({ name: 'waveNumber' })
    readonly id: number;

    /**
     * イベントID(nullを0に置換する)
     */
    get eventType(): EventId {
      return this.eventWave?.id ?? EventId.WaterLevels;
    }
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
    @Type(() => Common.PlayerId)
    @Transform(({ value }) => new Common.PlayerId(value))
    readonly id: Common.PlayerId;

    @ApiProperty({ enum: Species, required: true })
    @IsEnum(Species)
    @Expose()
    readonly species: Species;
  }

  export class MemberResult {
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
    @Expose({ name: 'defeatEnemyCount' })
    readonly bossKillCountsTotal: number;

    @ApiProperty({ minimum: 0, required: true, type: 'integer' })
    @IsInt()
    @Min(0)
    @Expose({ name: 'deliverCount' })
    readonly ikuraNum: number;

    @ApiProperty({ minimum: 0, required: true, type: 'integer' })
    @IsInt()
    @Min(0)
    @Expose({ name: 'goldenAssistCount' })
    readonly goldenIkuraAssistNum: number;

    @ApiProperty({ minimum: 0, required: true, type: 'integer' })
    @IsInt()
    @Min(0)
    @Expose({ name: 'goldenDeliverCount' })
    readonly goldenIkuraNum: number;

    @ApiProperty({ minimum: 0, required: true, type: 'integer' })
    @IsInt()
    @Min(0)
    @Expose({ name: 'rescueCount' })
    readonly helpCount: number;

    @ApiProperty({ minimum: 0, required: true, type: 'integer' })
    @IsInt()
    @Min(0)
    @Expose({ name: 'rescuedCount' })
    readonly deadCount: number;

    /**
     * 支給ブキ
     */
    get weaponList(): WeaponInfoMain.Id[] {
      return this.weapons.map((weapon) => weapon.image.id);
    }

    /**
     * バッジ
     */
    get badges(): number[] {
      return this.player.nameplate.badges.map((badge) => (badge === null ? null : badge.id));
    }

    /**
     * NPLNユーザーID
     */
    get nplnUserId(): string {
      return this.player.id.nplnUserId;
    }

    /**
     * プレイヤー自身かどうか
     */
    get isMyself(): boolean {
      return this.player.id.isMyself;
    }

    /**
     * ID(生データ)
     */
    get id(): string {
      return this.player.id.rawValue;
    }

    /**
     * 背景ID
     */
    get background(): number {
      return this.player.nameplate.background.id;
    }

    /**
     * テキストカラー
     */
    get textColor(): number[] {
      return [
        this.player.nameplate.background.textColor.r,
        this.player.nameplate.background.textColor.g,
        this.player.nameplate.background.textColor.b,
        this.player.nameplate.background.textColor.a,
      ];
    }
  }

  export class CoopHistoryDetail {
    @ApiProperty({ required: true, type: 'string' })
    @Expose()
    @Type(() => Common.ResultId)
    @Transform(({ value }) => Common.ResultId.from(value))
    readonly id: Common.ResultId;

    @ApiProperty({ required: true, type: AfterGrade })
    @Expose()
    @Transform(({ value }) => plainToInstance(AfterGrade, value === null ? { id: null } : value))
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

    @ApiProperty({ isArray: true, maxItems: 14, minItems: 0, required: true, type: EnemyResult })
    @IsArray()
    @ArrayMinSize(0)
    @ArrayMaxSize(14)
    @Expose()
    @Type(() => EnemyResult)
    @ValidateNested({ each: true })
    readonly enemyResults: EnemyResult[];

    @ApiProperty({ isArray: true, maxItems: 5, minItems: 0, required: true, type: WaveResult })
    @IsArray()
    @ArrayMinSize(0)
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

    @ApiProperty({ required: true, type: StageScheduleQuery.CoopStage })
    @Expose()
    @Type(() => StageScheduleQuery.CoopStage)
    @ValidateNested()
    readonly coopStage: StageScheduleQuery.CoopStage;

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

    @ApiProperty({ isArray: true, maxItems: 4, minItems: 0, required: true, type: MainWeapon })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(0)
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
    @Expose({ name: 'afterGradePoint' })
    readonly gradePoint: number | null;

    @ApiProperty({ nullable: true, required: true, type: Scale })
    @IsOptional()
    @Type(() => Scale)
    @Transform(({ value }) => (value === null ? Scale.from(null, null, null) : plainToInstance(Scale, value)))
    @ValidateNested()
    @Expose()
    readonly scale: Scale;

    @ApiProperty({ minimum: 0, nullable: true, required: true, type: 'integer' })
    @IsInt()
    @IsOptional()
    @Min(0)
    @Expose({ name: 'jobPoint' })
    readonly kumaPoint: number | null;

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

    /**
     * モード
     */
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

    /**
     * 支給ブキ
     */
    get weaponList(): number[] {
      return this.weapons.map((weapon) => weapon.image.id);
    }

    /**
     * オカシラシャケ
     */
    get bossId(): number | null {
      return this.bossResult === null ? null : this.bossResult.boss.id;
    }

    /**
     * 失敗したWAVE, クリアした場合はnull
     */
    get failureWave(): number | null {
      return this.resultWave === 0 ? null : this.resultWave;
    }

    /**
     * オカシラシャケをたおしたかどうか
     */
    get isBossDefeated(): boolean | null {
      return this.bossResult === null ? null : this.bossResult.hasDefeatBoss;
    }

    /**
     * クリアしたかどうか(オカシラシャケ失敗でもtrue)
     */
    get isClear(): boolean {
      return this.resultWave === 0;
    }

    /**
     * プレイヤー一覧
     */
    private get players(): MemberResult[] {
      return [this.myResult].concat(this.memberResults);
    }

    /**
     * 合計獲得イクラ数
     */
    get ikuraNum(): number {
      return this.players.map((player) => player.ikuraNum).reduce((a, b) => a + b);
    }

    /**
     * 合計獲得金イクラ数(ハコビヤに吸われた数を考慮する)
     */
    get goldenIkuraNum(): number {
      return this.waveResults.map((wave) => wave.goldenIkuraNum ?? 0).reduce((a, b) => a + b);
    }

    /**
     * 合計アシスト金イクラ数
     */
    get goldenIkuraAssistNum(): number {
      return this.players.map((player) => player.goldenIkuraAssistNum).reduce((a, b) => a + b);
    }

    /**
     * オオモノシャケ出現数
     */
    get bossCounts(): number[] {
      return Object.values(CoopEnemyInfoId)
        .filter((id) => !isNaN(id as number))
        .map((id) => this.enemyResults.find((enemy) => enemy.enemy.id === id)?.popCount ?? 0);
    }

    /**
     * オオモノシャケ討伐数(個人)
     */
    get bossKillCounts(): number[] {
      return Object.values(CoopEnemyInfoId)
        .filter((id) => !isNaN(id as number))
        .map((id) => this.enemyResults.find((enemy) => enemy.enemy.id === id)?.defeatCount ?? 0);
    }

    /**
     * オオモノシャケ討伐数(全体)
     */
    get teamBossKillCounts(): number[] {
      return Object.values(CoopEnemyInfoId)
        .filter((id) => !isNaN(id as number))
        .map((id) => this.enemyResults.find((enemy) => enemy.enemy.id === id)?.teamDefeatCount ?? 0);
    }
  }

  class CoopResultDataClass {
    @ApiProperty({ required: true, type: CoopHistoryDetail })
    @Expose()
    @Type(() => CoopHistoryDetail)
    @ValidateNested()
    readonly coopHistoryDetail: CoopHistoryDetail;
  }

  export class Request {
    @ApiProperty({ required: true, type: CoopResultDataClass })
    @Expose()
    @Type(() => CoopResultDataClass)
    @ValidateNested()
    readonly data: CoopResultDataClass;

    get playTime(): Date {
      return this.data.coopHistoryDetail.id.playTime;
    }

    get stageId(): CoopStageId {
      return this.data.coopHistoryDetail.coopStage.id;
    }

    get weaponList(): WeaponInfoMain.Id[] {
      return this.data.coopHistoryDetail.weaponList;
    }

    get mode(): Mode {
      return this.data.coopHistoryDetail.mode;
    }

    get rule(): Rule {
      return this.data.coopHistoryDetail.rule;
    }
  }

  export class Paginated {
    @ApiProperty({ deprecated: true, isArray: true, type: CoopHistoryDetailQuery.Request })
    @Expose()
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    @ArrayMaxSize(200)
    @ValidateNested({ each: true })
    @Type(() => CoopHistoryDetailQuery.Request)
    results: CoopHistoryDetailQuery.Request[];
  }
}
