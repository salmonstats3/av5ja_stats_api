import { ApiProperty } from '@nestjs/swagger';
import { Mode, Prisma, Rule, Schedule, Species } from '@prisma/client';
import { Expose, Transform, Type, plainToInstance } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import dayjs from 'dayjs';
import { CoopBossInfoId } from 'src/utils/enum/coop_enemy_id';
import { CoopGradeId } from 'src/utils/enum/coop_grade_id';
import { CoopStageId } from 'src/utils/enum/coop_stage_id';
import { EventId } from 'src/utils/enum/event_wave';
import { WaterLevelId } from 'src/utils/enum/water_level';
import { WeaponInfoMain } from 'src/utils/enum/weapon_info_main';
import { WeaponInfoSpecial } from 'src/utils/enum/weapon_info_special';
import { resultHash } from 'src/utils/hash';

import { Common } from './common.dto';
import { CoopHistoryDetailQuery } from './history.detail.request.dto';
import { CoopHistoryQuery } from './history.dto';

/**
 * CoopHistoryDetailQuery -> CoopResultQuery
 */
export namespace CoopResultQuery {
  class TextColor {
    @ApiProperty()
    @Expose()
    @IsNumber()
    @Min(0)
    @Max(1)
    readonly r: number;

    @ApiProperty()
    @Expose()
    @IsNumber()
    @Min(0)
    @Max(1)
    readonly g: number;

    @ApiProperty()
    @Expose()
    @IsNumber()
    @Min(0)
    @Max(1)
    readonly b: number;

    @ApiProperty()
    @Expose()
    @IsNumber()
    @Min(0)
    @Max(1)
    readonly a: number;

    get rawValue(): number[] {
      return [this.r, this.g, this.b, this.a];
    }
  }

  class Background {
    @ApiProperty()
    @Expose()
    @IsInt()
    @Type(() => TextColor)
    readonly textColor: TextColor;

    @ApiProperty()
    @Expose()
    @IsInt()
    readonly id: number;

    static from(textColor: any, id: number) {
      return plainToInstance(Background, {
        id: id,
        textColor: {
          a: textColor[3],
          b: textColor[2],
          g: textColor[1],
          r: textColor[0],
        },
      });
    }
  }

  class Nameplate {
    @ApiProperty()
    @Expose()
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(3)
    @ArrayMaxSize(3)
    readonly badges: (number | null)[];

    @ApiProperty()
    @Expose()
    @Type(() => Background)
    readonly background: Background;

    /**
     *
     * @param badge −1をnullに置換する
     * @param textColor (R,G,B,A)
     * @param id NamePlateBgInfo.Id
     */
    static from(badge: number[], textColor: number[], id: number): Nameplate {
      return plainToInstance(Nameplate, {
        background: Background.from(textColor, id),
        badges: badge.map((b) => (b === -1 ? null : b)),
      });
    }
  }

  export class WaveResult {
    @ApiProperty({ enum: WaterLevelId, required: true })
    @IsEnum(WaterLevelId)
    @Expose()
    readonly waterLevel: WaterLevelId;

    @ApiProperty({ required: true, type: EventId })
    @Expose()
    @IsEnum(EventId)
    readonly eventType: EventId;

    @ApiProperty({ minimum: 0, nullable: true, required: true, type: 'integer' })
    @IsInt()
    @IsOptional()
    @Min(0)
    @Expose()
    readonly quotaNum: number | null;

    @ApiProperty({ minimum: 0, required: true, type: 'integer' })
    @IsInt()
    @Min(0)
    @Expose()
    readonly goldenIkuraPopNum: number;

    @ApiProperty({ minimum: 0, nullable: true, required: true, type: 'integer' })
    @IsInt()
    @IsOptional()
    @Min(0)
    @Expose()
    readonly goldenIkuraNum: number | null;

    @ApiProperty({ minimum: 0, required: true, type: 'integer' })
    @IsInt()
    @Min(0)
    @Expose()
    readonly id: number;

    @ApiProperty({ required: true })
    @IsBoolean()
    @Expose()
    readonly isClear: boolean;

    static from(wave: CoopHistoryDetailQuery.WaveResult, resultWave: number, isBossDefeated: boolean | null): WaveResult {
      return plainToInstance(
        CoopResultQuery.WaveResult,
        {
          eventType: wave.eventType,
          goldenIkuraNum: wave.goldenIkuraNum,
          goldenIkuraPopNum: wave.goldenIkuraPopNum,
          id: wave.id,
          isClear: isBossDefeated === null ? wave.id !== resultWave : wave.quotaNum === null ? isBossDefeated : true,
          quotaNum: wave.quotaNum,
          waterLevel: wave.waterLevel,
        },
        { excludeExtraneousValues: true },
      );
    }

    get create(): Prisma.WaveCreateManyResultInput {
      return {
        eventType: this.eventType,
        goldenIkuraNum: this.goldenIkuraNum,
        goldenIkuraPopNum: this.goldenIkuraPopNum,
        isClear: this.isClear,
        quotaNum: this.quotaNum,
        waterLevel: this.waterLevel,
        waveId: this.id,
      };
    }
  }

  class JobResult {
    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsInt()
    readonly bossId: CoopBossInfoId | null;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsBoolean()
    readonly isBossDefeated: boolean | null;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsInt()
    readonly failureWave: number | null;

    @ApiProperty()
    @Expose()
    @IsBoolean()
    readonly isClear: boolean;

    static from(result: CoopHistoryDetailQuery.CoopHistoryDetail): JobResult {
      return plainToInstance(JobResult, {
        bossId: result.bossId,
        failureWave: result.failureWave,
        isBossDefeated: result.isBossDefeated,
        isClear: result.isClear,
      });
    }
  }

  class PlayerResult {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Expose()
    readonly byname: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Expose()
    readonly name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Expose()
    readonly nameId: string;

    @ApiProperty()
    @Type(() => Nameplate)
    @Expose()
    readonly nameplate: Nameplate;

    @ApiProperty()
    @Expose()
    @IsInt()
    @Min(0)
    readonly uniform: number;

    @ApiProperty({ example: '20230923T213430:a7grz65rxkvhfsbwmxmm', required: true, type: String })
    @Expose()
    @IsString()
    @IsNotEmpty()
    @Length(36, 36)
    readonly id: string;

    @ApiProperty()
    @Expose()
    @IsEnum(Species)
    readonly species: Species;

    @ApiProperty({ enum: WeaponInfoMain.Id, isArray: true })
    @IsArray()
    @ArrayMinSize(0)
    @ArrayMaxSize(5)
    @Expose()
    @IsEnum(WeaponInfoMain.Id, { each: true })
    readonly weaponList: WeaponInfoMain.Id[];

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsEnum(WeaponInfoSpecial.Id)
    readonly specialId: WeaponInfoSpecial.Id;

    @ApiProperty()
    @Expose()
    @IsInt()
    @Min(0)
    readonly bossKillCountsTotal: number;

    @ApiProperty()
    @IsInt()
    @Min(0)
    @Expose()
    readonly ikuraNum: number;

    @ApiProperty()
    @IsInt()
    @Min(0)
    @Expose()
    readonly goldenIkuraNum: number;

    @ApiProperty()
    @Expose()
    @IsString()
    @Length(20, 20)
    @Expose()
    readonly nplnUserId: string;

    @ApiProperty()
    @IsBoolean()
    @Expose()
    readonly isMyself: boolean;

    @ApiProperty()
    @IsInt()
    @Min(0)
    @Expose()
    readonly goldenIkuraAssistNum: number;

    @ApiProperty()
    @IsInt()
    @Min(0)
    @Expose()
    readonly deadCount: number;

    @ApiProperty()
    @IsInt()
    @Min(0)
    @Expose()
    readonly helpCount: number;

    @ApiProperty()
    @Expose()
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(0)
    @ArrayMaxSize(5)
    @Type(() => Number)
    readonly specialCounts: number[];

    @ApiProperty()
    @Expose()
    @IsArray()
    @ArrayMinSize(14)
    @ArrayMaxSize(14)
    @Type(() => Number)
    @Transform(({ value }) => value.map((v: number) => (v === -1 ? null : v)))
    readonly bossKillCounts: (number | null)[];

    static from(
      member: CoopHistoryDetailQuery.MemberResult,
      bossKillCounts: number[],
      waveDetails: CoopHistoryDetailQuery.WaveResult[],
    ): PlayerResult {
      const specialCounts: number[] = waveDetails.map(
        (wave) => wave.specialWeapons.filter((special) => special.id === member.specialWeapon.id).length,
      );
      return plainToInstance(PlayerResult, {
        bossKillCounts: member.isMyself ? bossKillCounts : new Array(14).fill(null),
        bossKillCountsTotal: member.bossKillCountsTotal,
        byname: member.player.byname,
        deadCount: member.deadCount,
        goldenIkuraAssistNum: member.goldenIkuraAssistNum,
        goldenIkuraNum: member.goldenIkuraNum,
        helpCount: member.helpCount,
        id: member.player.id.rawId,
        ikuraNum: member.ikuraNum,
        isMyself: member.isMyself,
        name: member.player.name,
        nameId: member.player.nameId,
        nameplate: Nameplate.from(member.badges, member.textColor, member.background),
        nplnUserId: member.nplnUserId,
        specialCounts: specialCounts,
        specialId: member.specialWeapon.id,
        species: member.player.species,
        uniform: member.player.uniform.id,
        weaponList: member.weaponList,
      });
    }

    private gradeId(gradeId: number | null): CoopGradeId | null {
      return this.isMyself ? gradeId : null;
    }

    private gradePoint(gradePoint: number | null): number | null {
      return this.isMyself ? gradePoint : null;
    }

    private jobRate(jobRate: number | null): number | null {
      return this.isMyself ? jobRate : null;
    }

    private jobBonus(jobBonus: number | null): number {
      return this.isMyself ? jobBonus : null;
    }

    private jobScore(jobScore: number | null): number | null {
      return this.isMyself ? jobScore : null;
    }

    private kumaPoint(kumaPoint: number | null): number | null {
      return this.isMyself ? kumaPoint : null;
    }

    private smellMeter(smellMeter: number | null): number | null {
      return this.isMyself ? smellMeter : null;
    }

    update(
      id: Common.ResultId,
      gradeId: number | null,
      gradePoint: number | null,
      jobBonus: number | null,
      jobScore: number | null,
      kumaPoint: number | null,
      jobRate: number | null,
      smellMeter: number | null,
    ): Prisma.PlayerUpdateArgs {
      return {
        data: {
          badges: this.nameplate.badges.map((badge) => (badge === null ? -1 : badge)),
          bossKillCounts: this.bossKillCounts.map((badge) => (badge === null ? -1 : badge)),
          bossKillCountsTotal: this.bossKillCountsTotal,
          byname: this.byname,
          deadCount: this.deadCount,
          goldenIkuraAssistNum: this.goldenIkuraAssistNum,
          goldenIkuraNum: this.goldenIkuraNum,
          gradeId: gradeId,
          gradePoint: gradePoint,
          helpCount: this.helpCount,
          ikuraNum: this.ikuraNum,
          jobBonus: jobBonus,
          jobRate: jobRate,
          jobScore: jobScore,
          kumaPoint: kumaPoint,
          name: this.name,
          nameId: this.nameId,
          nameplate: this.nameplate.background.id,
          nplnUserId: this.nplnUserId,
          smellMeter: smellMeter,
          specialCounts: this.specialCounts,
          specialId: this.specialId,
          species: this.species,
          textColor: this.nameplate.background.textColor.rawValue,
          uniform: this.uniform,
          weaponList: this.weaponList,
        },
        where: {
          playTime_uuid_nplnUserId: {
            nplnUserId: this.nplnUserId,
            playTime: id.playTime,
            uuid: id.uuid,
          },
        },
      };
    }

    create(
      gradeId: number | null,
      gradePoint: number | null,
      jobRate: number | null,
      jobBonus: number | null,
      jobScore: number | null,
      kumaPoint: number | null,
      smellMeter: number | null,
    ): Prisma.PlayerCreateManyResultInput {
      return {
        badges: this.nameplate.badges.map((badge) => (badge === null ? -1 : badge)),
        bossKillCounts: this.bossKillCounts.map((badge) => (badge === null ? -1 : badge)),
        bossKillCountsTotal: this.bossKillCountsTotal,
        byname: this.byname,
        deadCount: this.deadCount,
        goldenIkuraAssistNum: this.goldenIkuraAssistNum,
        goldenIkuraNum: this.goldenIkuraNum,
        gradeId: this.gradeId(gradeId),
        gradePoint: this.gradePoint(gradePoint),
        helpCount: this.helpCount,
        ikuraNum: this.ikuraNum,
        jobBonus: this.jobBonus(jobBonus),
        jobRate: this.jobRate(jobRate),
        jobScore: this.jobScore(jobScore),
        kumaPoint: this.kumaPoint(kumaPoint),
        name: this.name,
        nameId: this.nameId,
        nameplate: this.nameplate.background.id,
        nplnUserId: this.nplnUserId,
        smellMeter: this.smellMeter(smellMeter),
        specialCounts: this.specialCounts,
        specialId: this.specialId,
        species: this.species,
        textColor: this.nameplate.background.textColor.rawValue,
        uniform: this.uniform,
        weaponList: this.weaponList,
      };
    }
  }

  export class Request {
    @ApiProperty({ required: true, type: Common.ResultId })
    @Type(() => Common.ResultId)
    @Expose()
    @ValidateNested()
    readonly id: Common.ResultId;

    @ApiProperty({ required: true, type: 'uuid' })
    @IsUUID()
    @Expose()
    @Transform(({ obj }) => obj.id.uuid.toUpperCase())
    readonly uuid: string;

    @ApiProperty({ isArray: true, nullable: true, required: true, type: 'integer' })
    @IsArray()
    @ArrayMaxSize(3)
    @ArrayMinSize(3)
    @Type(() => Number)
    @Expose()
    readonly scale: (number | null)[];

    @ApiProperty({ nullable: true, required: true, type: 'integer' })
    @IsInt()
    @IsOptional()
    @Expose()
    readonly jobScore: number | null;

    @ApiProperty({ enum: CoopGradeId, nullable: true, required: true })
    @IsEnum(CoopGradeId)
    @IsOptional()
    @Expose()
    readonly gradeId: CoopGradeId | null;

    @ApiProperty({ nullable: true, required: true, type: 'integer' })
    @IsInt()
    @IsOptional()
    @Expose()
    readonly kumaPoint: number | null;

    @ApiProperty({ isArray: true, required: true, type: WaveResult })
    @IsArray()
    @ArrayMaxSize(5)
    @ArrayMinSize(1)
    @Type(() => WaveResult)
    @ValidateNested({ each: true })
    @Expose()
    readonly waveDetails: WaveResult[];

    @ApiProperty({ required: true, type: JobResult })
    @Type(() => JobResult)
    @ValidateNested()
    @Expose()
    readonly jobResult: JobResult;

    @ApiProperty({ required: true, type: PlayerResult })
    @Type(() => PlayerResult)
    @ValidateNested()
    @Expose()
    readonly myResult: PlayerResult;

    @ApiProperty({ isArray: true, required: true, type: PlayerResult })
    @Type(() => PlayerResult)
    @ValidateNested({ each: true })
    @Expose()
    readonly otherResults: PlayerResult[];

    @ApiProperty({ nullable: true, required: true, type: 'integer' })
    @IsInt()
    @IsOptional()
    @Min(0)
    @Max(999)
    @Expose()
    readonly gradePoint: number | null;

    @ApiProperty({ nullable: true, required: true, type: 'integer' })
    @IsInt()
    @IsOptional()
    @Min(0)
    @Max(3.33)
    @Expose()
    readonly jobRate: number | null;

    @ApiProperty({ required: true, type: Date })
    @IsDate()
    @Expose()
    @Transform(({ obj }) => dayjs(obj.id.playTime).toDate())
    readonly playTime: Date;

    @ApiProperty({ isArray: true, required: true, type: Number })
    @IsArray()
    @ArrayMaxSize(14)
    @ArrayMinSize(14)
    @Expose()
    readonly bossCounts: (number | null)[];

    @ApiProperty({ isArray: true, required: true, type: Number })
    @IsArray()
    @ArrayMaxSize(14)
    @ArrayMinSize(14)
    @Expose()
    readonly bossKillCounts: (number | null)[];

    @ApiProperty({ required: true, type: Number })
    @IsNumber()
    @Min(0)
    @Max(3.33)
    @Expose()
    readonly dangerRate: number;

    @ApiProperty({ required: true, type: Number })
    @IsNumber()
    @Min(0)
    @Max(100)
    @Expose()
    readonly jobBonus: number;

    @ApiProperty({ required: true, type: CoopHistoryQuery.Schedule })
    @Type(() => CoopHistoryQuery.Schedule)
    @ValidateNested()
    @Expose()
    readonly schedule: CoopHistoryQuery.Schedule;

    @ApiProperty({ required: true, type: 'integer' })
    @IsInt()
    @Min(0)
    @Expose()
    readonly goldenIkuraNum: number;

    @ApiProperty({ required: true, type: 'integer' })
    @IsInt()
    @Min(0)
    @Expose()
    readonly goldenIkuraAssistNum: number;

    @ApiProperty({ required: true, type: 'integer' })
    @IsInt()
    @Min(0)
    @Expose()
    readonly ikuraNum: number;

    @ApiProperty({ nullable: true, required: true, type: 'integer' })
    @IsInt()
    @IsOptional()
    @Min(0)
    @Max(5)
    @Expose()
    readonly smellMeter: number | null;

    @ApiProperty({ nullable: true, required: true, type: String })
    @IsString()
    @IsOptional()
    @Expose()
    readonly scenarioCode: string | null;

    static from(result: CoopHistoryDetailQuery.CoopHistoryDetail, schedule: Partial<Schedule>): CoopResultQuery.Request {
      return plainToInstance(
        CoopResultQuery.Request,
        {
          bossCounts: result.bossCounts,
          bossKillCounts: result.teamBossKillCounts,
          dangerRate: result.dangerRate,
          goldenIkuraAssistNum: result.goldenIkuraAssistNum,
          goldenIkuraNum: result.goldenIkuraNum,
          gradeId: result.afterGrade.id,
          gradePoint: result.gradePoint,
          id: {
            nplnUserId: result.id.nplnUserId,
            playTime: result.id.playTime,
            type: result.id.type,
            uuid: result.id.uuid,
          },
          ikuraNum: result.ikuraNum,
          jobBonus: result.jobBonus,
          jobRate: result.jobRate,
          jobResult: JobResult.from(result),
          jobScore: result.jobScore,
          kumaPoint: result.kumaPoint,
          myResult: PlayerResult.from(result.myResult, result.bossKillCounts, result.waveResults),
          otherResults: result.memberResults.map((member) => PlayerResult.from(member, result.bossKillCounts, result.waveResults)),
          playTime: result.id.playTime,
          scale: [result.scale.bronze, result.scale.silver, result.scale.gold],
          scenarioCode: result.scenarioCode,
          schedule: schedule,
          smellMeter: result.smellMeter,
          uuid: result.id.uuid,
          waveDetails: result.waveResults.map((wave) => WaveResult.from(wave, result.resultWave, result.isBossDefeated)),
        },
        { excludeExtraneousValues: true },
      );
    }

    /**
     * 夜WAVEを含まないかどうか
     */
    private get nightLess(): boolean {
      return this.waveDetails.every((wave) => wave.eventType === EventId.WaterLevels);
    }

    /**
     * プレイヤー一覧
     */
    private get players(): Prisma.PlayerCreateManyResultInputEnvelope {
      return {
        data: [this.myResult, ...this.otherResults].map((player) =>
          player.create(this.gradeId, this.gradePoint, this.jobRate, this.jobBonus, this.jobScore, this.kumaPoint, this.smellMeter),
        ),
        skipDuplicates: true,
      };
    }

    private get waves(): Prisma.WaveCreateManyResultInputEnvelope {
      return {
        data: this.waveDetails.map((wave) => wave.create),
        skipDuplicates: true,
      };
    }

    private get resultId(): string {
      return resultHash(this.id.uuid, this.id.playTime);
    }

    get rule(): Rule {
      return this.schedule.rule;
    }

    get mode(): Mode {
      return this.schedule.mode;
    }

    get stageId(): CoopStageId {
      return this.schedule.stageId;
    }

    get weaponList(): WeaponInfoMain.Id[] {
      return this.schedule.weaponList;
    }

    get upsert(): Prisma.ResultUpsertArgs {
      return {
        create: {
          bossCounts: this.bossCounts,
          bossId: this.jobResult.bossId,
          bossKillCounts: this.bossKillCounts,
          bronze: this.scale[0],
          dangerRate: this.dangerRate,
          failureWave: this.jobResult.failureWave,
          gold: this.scale[2],
          goldenIkuraAssistNum: this.goldenIkuraAssistNum,
          goldenIkuraNum: this.goldenIkuraNum,
          ikuraNum: this.ikuraNum,
          isBossDefeated: this.jobResult.isBossDefeated,
          isClear: this.jobResult.isClear,
          nightLess: this.nightLess,
          playTime: this.playTime,
          players: {
            createMany: this.players,
          },
          scenarioCode: this.scenarioCode,
          schedule: {
            connectOrCreate: this.schedule.connectOrCreate,
          },
          silver: this.scale[1],
          uuid: this.uuid,
          waves: {
            createMany: this.waves,
          },
        },
        update: {
          players: {
            update: this.myResult.update(
              this.id,
              this.gradeId,
              this.gradePoint,
              this.jobBonus,
              this.jobScore,
              this.kumaPoint,
              this.jobRate,
              this.smellMeter,
            ),
          },
        },
        where: {
          playTime_uuid: {
            playTime: this.playTime,
            uuid: this.uuid,
          },
        },
      };
    }
  }

  export class Paginated {
    @ApiProperty({ deprecated: true, isArray: true, type: CoopResultQuery.Request })
    @Expose()
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(200)
    @ValidateNested({ each: true })
    @Type(() => CoopResultQuery.Request)
    results: CoopResultQuery.Request[];
  }
}
