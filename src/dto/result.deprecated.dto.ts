import { createHash } from 'crypto';

import { ApiProperty } from '@nestjs/swagger';
import { Mode, Prisma, Rule, Species } from '@prisma/client';
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
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import dayjs from 'dayjs';
import { EventId } from 'src/utils/enum/event_wave';
import { WaterLevelId } from 'src/utils/enum/water_level';
import { scheduleHash } from 'src/utils/hash';

export namespace ResultDeprecatedDto {
  class CoopScheduleRequest {
    @ApiProperty()
    @Expose()
    readonly stageId: number;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsDate()
    @Transform((param) => (param.value === null ? dayjs('1970-01-01T00:00:00.000Z').toDate() : dayjs(param.value).toDate()))
    readonly startTime: Date;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsDate()
    @Transform((param) => (param.value === null ? dayjs('1970-01-01T00:00:00.000Z').toDate() : dayjs(param.value).toDate()))
    readonly endTime: Date;

    @ApiProperty()
    @Expose()
    readonly weaponList: number[];

    @ApiProperty()
    @Expose()
    readonly rareWeapon: number | null;

    @ApiProperty()
    @Expose()
    @IsEnum(Mode)
    readonly mode: Mode;

    @ApiProperty()
    @Expose()
    @IsEnum(Rule)
    readonly rule: Rule;

    get scheduleId(): string {
      return scheduleHash(this.mode, this.rule, this.startTime, this.endTime, this.stageId, this.weaponList);
    }

    get connectOrCreate(): Prisma.ScheduleCreateOrConnectWithoutResultsInput {
      return {
        create: {
          endTime: this.endTime,
          mode: this.mode,
          rule: this.rule,
          scheduleId: this.scheduleId,
          stageId: this.stageId,
          startTime: this.startTime,
          weaponList: this.weaponList,
        },
        where: {
          scheduleId: this.scheduleId,
        },
      };
    }
  }

  class CoopJobRequest {
    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsInt()
    readonly bossId: number | null;

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
  }

  class CoopTextColorRequest {
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
  }

  class CoopBackgroundRequest {
    @ApiProperty()
    @Expose()
    @IsInt()
    readonly id: number;

    @ApiProperty()
    @Expose()
    @ValidateNested({ each: true })
    @Type(() => CoopTextColorRequest)
    readonly textColor: CoopTextColorRequest;
  }

  class CoopNameplateRequest {
    @ApiProperty()
    @Expose()
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(3)
    @ArrayMaxSize(3)
    @Type(() => Number)
    @Transform((param) => param.value.map((value: number) => (value === null ? -1 : value)))
    readonly badges: number[];

    @ApiProperty()
    @Expose()
    @ValidateNested({ each: true })
    @Type(() => CoopBackgroundRequest)
    readonly background: CoopBackgroundRequest;
  }

  class CoopResultIdRequest {
    @ApiProperty()
    @Expose()
    @IsString()
    @MinLength(20)
    @MaxLength(20)
    readonly nplnUserId: string;

    @ApiProperty()
    @Expose()
    @IsDate()
    @Transform((param) => dayjs(param.value).toDate())
    readonly playTime: Date;

    @ApiProperty()
    @Expose()
    @IsUUID()
    @Transform((param) => param.value.toLowerCase())
    readonly uuid: string;
  }

  class CoopPlayerRequest {
    @ApiProperty()
    @Expose()
    @IsArray()
    @ArrayMinSize(14)
    @ArrayMaxSize(14)
    @Type(() => Number)
    readonly bossKillCounts: number[];

    @ApiProperty()
    @Expose()
    @IsString()
    readonly name: string;

    @ApiProperty()
    @Expose()
    @IsString()
    readonly byname: string;

    @ApiProperty()
    @Expose()
    @IsInt()
    @Min(0)
    readonly bossKillCountsTotal: number;

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
    @IsInt()
    @Min(0)
    readonly ikuraNum: number;

    @ApiProperty()
    @Expose()
    @IsBoolean()
    readonly isMyself: boolean;

    @ApiProperty()
    @Expose()
    @ValidateNested({ each: true })
    @Type(() => CoopNameplateRequest)
    readonly nameplate: CoopNameplateRequest;

    @ApiProperty()
    @Expose()
    @IsString()
    @Length(20, 20)
    readonly nplnUserId: string;

    @ApiProperty()
    @Expose()
    @IsInt()
    @Min(0)
    readonly helpCount: number;

    @ApiProperty()
    @Expose()
    @IsInt()
    @Min(0)
    readonly deadCount: number;

    @ApiProperty()
    @Expose()
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(0)
    @ArrayMaxSize(5)
    @Type(() => Number)
    readonly weaponList: number[];

    @ApiProperty()
    @Expose()
    @IsString()
    readonly nameId: string;

    @ApiProperty()
    @Expose()
    @IsInt()
    @Min(0)
    readonly goldenIkuraAssistNum: number;

    @ApiProperty()
    @Expose()
    @IsEnum(Species)
    readonly species: Species;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    readonly specialId: number | null;

    @ApiProperty()
    @Expose()
    @IsInt()
    @Min(0)
    readonly goldenIkuraNum: number;

    @ApiProperty()
    @Expose()
    @IsInt()
    @Min(0)
    readonly uniform: number;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(5)
    @Transform(({ value }) => (value === undefined ? null : value))
    readonly smellMeter: number | null;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    @Transform(({ value }) => (value === undefined ? null : value))
    readonly jobBonus: number | null;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => (value === undefined ? null : value))
    readonly jobScore: number | null;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => (value === undefined ? null : value))
    readonly jobRate: number | null;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(8)
    @Transform(({ value }) => (value === undefined ? null : value))
    readonly gradeId: number | null;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(999)
    @Transform(({ value }) => (value === undefined ? null : value))
    readonly gradePoint: number | null;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    @Transform(({ value }) => (value === undefined ? null : value))
    readonly kumaPoint: number | null;

    private get textColor(): number[] {
      return Object.values(this.nameplate.background.textColor);
    }

    get create(): Prisma.PlayerCreateWithoutResultInput {
      return {
        badges: this.nameplate.badges,
        bossKillCounts: this.bossKillCounts,
        bossKillCountsTotal: this.bossKillCountsTotal,
        byname: this.byname,
        deadCount: this.deadCount,
        goldenIkuraAssistNum: this.goldenIkuraAssistNum,
        goldenIkuraNum: this.goldenIkuraNum,
        gradeId: this.gradeId,
        gradePoint: this.gradePoint,
        helpCount: this.helpCount,
        ikuraNum: this.ikuraNum,
        jobBonus: this.jobBonus,
        jobRate: this.jobRate,
        jobScore: this.jobScore,
        kumaPoint: this.kumaPoint,
        name: this.name,
        nameId: this.nameId,
        nameplate: this.nameplate.background.id,
        nplnUserId: this.nplnUserId,
        smellMeter: this.smellMeter,
        specialCounts: this.specialCounts,
        specialId: this.specialId,
        species: this.species,
        textColor: this.textColor,
        uniform: this.uniform,
        weaponList: this.weaponList,
      };
    }
  }

  export class CoopWaveRequest {
    @ApiProperty({ name: 'id' })
    @Expose({ name: 'id' })
    @IsInt()
    @Min(1)
    @Max(5)
    readonly waveId: number;

    @ApiProperty({ enum: EventId })
    @Expose()
    @IsEnum(EventId)
    readonly eventType: EventId;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(35)
    readonly quotaNum: number | null;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    readonly goldenIkuraNum: number | null;

    @ApiProperty({ enum: WaterLevelId })
    @Expose()
    @IsEnum(WaterLevelId)
    readonly waterLevel: WaterLevelId;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    readonly goldenIkuraPopNum: number;

    @ApiProperty()
    @Expose()
    @IsBoolean()
    readonly isClear: boolean;

    get create(): Prisma.WaveCreateWithoutResultInput {
      return {
        eventType: this.eventType,
        goldenIkuraNum: this.goldenIkuraNum,
        goldenIkuraPopNum: this.goldenIkuraPopNum,
        isClear: this.isClear,
        quotaNum: this.quotaNum,
        waterLevel: this.waterLevel,
        waveId: this.waveId,
      };
    }
  }

  export class CoopResultRequest {
    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsInt()
    readonly jobBonus: number | null;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(8)
    readonly gradeId: number | null;

    @ApiProperty()
    @Expose()
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(0)
    @ArrayMaxSize(5)
    @ValidateNested({ each: true })
    @Type(() => CoopWaveRequest)
    readonly waveDetails: CoopWaveRequest[];

    @ApiProperty()
    @Expose()
    @IsInt()
    @Min(0)
    readonly ikuraNum: number;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    readonly jobScore: number | null;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    readonly kumaPoint: number | null;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsNumber()
    @Min(0)
    readonly jobRate: number | null;

    @ApiProperty()
    @Expose()
    @IsInt()
    @Min(0)
    readonly goldenIkuraNum: number;

    @ApiProperty()
    @Expose()
    @ValidateNested({ each: true })
    @Type(() => CoopScheduleRequest)
    readonly schedule: CoopScheduleRequest;

    @ApiProperty()
    @Expose()
    @ValidateNested({ each: true })
    @Type(() => CoopJobRequest)
    readonly jobResult: CoopJobRequest;

    @ApiProperty()
    @Expose()
    @IsArray()
    @ArrayMinSize(14)
    @ArrayMaxSize(14)
    @Type(() => Number)
    readonly bossKillCounts: number[];

    @Expose({ name: 'id' })
    @Expose()
    @ApiProperty()
    @ValidateNested({ each: true })
    @Type(() => CoopResultIdRequest)
    readonly resultId: CoopResultIdRequest;

    @ApiProperty()
    @Expose()
    @Type(() => Number)
    readonly scale: number[];

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(5)
    readonly smellMeter: number | null;

    @ApiProperty()
    @Expose()
    @IsInt()
    @Min(0)
    readonly goldenIkuraAssistNum: number;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(999)
    readonly gradePoint: number | null;

    @ApiProperty()
    @Expose()
    @IsNumber()
    @Min(0)
    @Max(3.33)
    readonly dangerRate: number;

    @ApiProperty()
    @Expose()
    @Type(() => CoopPlayerRequest)
    @ValidateNested({ each: true })
    @Transform(({ value, obj }) => {
      return plainToInstance(CoopPlayerRequest, {
        ...value,
        ...{
          gradeId: obj.gradeId,
          gradePoint: obj.gradePoint,
          jobBonus: obj.jobBonus,
          jobRate: obj.jobRate,
          jobScore: obj.jobScore,
          kumaPoint: obj.kumaPoint,
          smellMeter: obj.smellMeter,
        },
      });
    })
    readonly myResult: CoopPlayerRequest;

    @ApiProperty()
    @Expose()
    @IsOptional()
    @IsString()
    readonly scenarioCode: string | null;

    @ApiProperty()
    @Expose()
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(14)
    @ArrayMaxSize(14)
    @Type(() => Number)
    readonly bossCounts: number[];

    @ApiProperty()
    @Expose()
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    @ArrayMaxSize(3)
    @ValidateNested({ each: true })
    @Type(() => CoopPlayerRequest)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Transform(({ value }) => value.map((player: any) => plainToInstance(CoopPlayerRequest, player)))
    readonly otherResults: CoopPlayerRequest[];

    /**
     * 全てのWAVEのeventTypeが0なら夜なし
     */
    private get nightLess(): boolean {
      return this.waveDetails.every((wave) => wave.eventType === 0);
    }

    /**
     * メンバー一覧
     */
    private get members(): string[] {
      return this.otherResults
        .concat(this.myResult)
        .map((player) => player.nplnUserId)
        .sort();
    }

    /**
     * 有効なリザルトかどうかをチェック
     */
    get isValid(): boolean {
      const currentTime: Date = new Date();
      /**
       * 1. キケン度が0
       * 2. いつものバイトでオカシラメーターがnull
       * 3. 全てのプレイヤーのスペシャルIDがnull
       * 4. 失敗WAVEが-1(回線落ち)
       * 5. プレイ時間が現在時刻より未来
       * 6. いつものバイトでプレイ時刻がスケジュールの範囲内でない
       */
      if (
        this.dangerRate === 0 ||
        (this.smellMeter === null && this.schedule.mode === Mode.REGULAR) ||
        this.otherResults.concat(this.myResult).every((player) => player.specialId === null) ||
        this.jobResult.failureWave === -1 ||
        this.resultId.playTime >= currentTime ||
        (this.schedule.mode === Mode.REGULAR &&
          (this.schedule.startTime > this.resultId.playTime || this.schedule.endTime < this.resultId.playTime))
      ) {
        return false;
      }
      return true;
    }

    private get resultHash(): string {
      return createHash('sha256')
        .update(`${this.resultId.uuid.toLowerCase()}-${dayjs(this.resultId.playTime).unix()}`)
        .digest('hex');
    }

    private get players(): CoopPlayerRequest[] {
      return [this.myResult].concat(this.otherResults);
    }

    private get create(): Prisma.ResultCreateInput {
      return {
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
        members: this.members,
        nightLess: this.nightLess,
        playTime: this.resultId.playTime,
        players: {
          createMany: {
            data: this.players.map((player) => player.create),
            skipDuplicates: true,
          },
        },
        resultId: this.resultHash,
        scenarioCode: this.scenarioCode,
        schedule: {
          connectOrCreate: this.schedule.connectOrCreate,
        },
        silver: this.scale[1],
        uuid: this.resultId.uuid,
        waves: {
          createMany: {
            data: this.waveDetails.map((wave) => wave.create),
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
              bossKillCounts: this.myResult.bossKillCounts,
              gradeId: this.myResult.gradeId,
              gradePoint: this.myResult.gradePoint,
              jobBonus: this.myResult.jobBonus,
              jobRate: this.myResult.jobRate,
              jobScore: this.myResult.jobScore,
              kumaPoint: this.myResult.kumaPoint,
              smellMeter: this.myResult.smellMeter,
            },
            where: {
              nplnUserId_playTime_uuid: {
                nplnUserId: this.myResult.nplnUserId,
                playTime: this.resultId.playTime,
                uuid: this.resultId.uuid,
              },
            },
          },
        },
      };
    }

    get upsert(): Prisma.ResultUpsertArgs {
      return {
        create: this.create,
        select: {
          resultId: true,
          scheduleId: true,
        },
        update: this.update,
        where: {
          uuid_scheduleId_playTime: {
            playTime: this.resultId.playTime,
            scheduleId: this.schedule.scheduleId,
            uuid: this.resultId.uuid,
          },
        },
      };
    }
  }
}
