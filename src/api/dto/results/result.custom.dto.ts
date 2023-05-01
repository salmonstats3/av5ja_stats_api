import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Expose, Transform, Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";
import dayjs from "dayjs";

import { Mode } from "../enum/mode";
import { Rule } from "../enum/rule";
import { Species } from "../enum/species";

export enum ResultStatus {
  VALID = "VALID",
  INVALID = "INVALID",
  FIXED = "FIXED",
  UNKNOWN = "UNKNOWN",
  PRIVATE = "PRIVATE",
}

/**
 * リストア用のリクエスト
 * @description 普段は使用しない
 */
export class CoopScheduleCustomRequest {
  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsDateString()
  @Transform((param) => (param.value == null ? null : dayjs(param.value).toDate()))
  startTime: Date | null;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsDateString()
  @Transform((param) => (param.value == null ? null : dayjs(param.value).toDate()))
  endTime: Date | null;

  @ApiProperty()
  @Expose()
  @IsInt()
  stageId: number;

  @ApiProperty()
  @Expose()
  @IsArray()
  @MaxLength(5)
  @MinLength(0)
  weaponList: number[];

  @ApiProperty()
  @Expose()
  @IsEnum(Mode)
  mode: Mode;

  @ApiProperty()
  @Expose()
  @IsEnum(Rule)
  rule: Rule;

  get query(): Prisma.ScheduleCreateOrConnectWithoutResultsInput {
    return this.mode == Mode.PRIVATE_CUSTOM || this.mode == Mode.PRIVATE_SCENARIO
      ? {
          create: {
            mode: this.mode,
            rule: this.rule,
            stageId: this.stageId,
            weaponList: this.weaponList,
          },
          where: {
            unique: {
              endTime: dayjs("1970-01-01T00:00:00.000Z").toDate(),
              mode: this.mode,
              rule: this.rule,
              stageId: this.stageId,
              startTime: dayjs("1970-01-01T00:00:00.000Z").toDate(),
              weaponList: this.weaponList,
            },
          },
        }
      : {
          create: {
            endTime: this.endTime,
            mode: this.mode,
            rule: this.rule,
            stageId: this.stageId,
            startTime: this.startTime,
            weaponList: this.weaponList,
          },
          where: {
            unique: {
              endTime: this.endTime,
              mode: this.mode,
              rule: this.rule,
              stageId: this.stageId,
              startTime: this.startTime,
              weaponList: this.weaponList,
            },
          },
        };
  }
}

export class CoopWaveCustomRequest {
  @ApiProperty()
  @Expose()
  @IsInt()
  waveId: number;

  @ApiProperty()
  @Expose()
  @IsInt()
  @Min(0)
  @Max(3)
  waterLevel: number;

  @ApiProperty()
  @Expose()
  @IsInt()
  @Min(0)
  @Max(8)
  eventType: number;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  goldenIkuraNum: number | null;

  @ApiProperty()
  @Expose()
  @IsInt()
  @Min(0)
  goldenIkuraPopNum: number;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(35)
  quotaNum: number | null;

  @ApiProperty()
  @Expose()
  @IsBoolean()
  isClear: boolean;

  get query(): Prisma.WaveCreateInput {
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

export class CoopPlayerCustomRequest {
  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  nplnUserId: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  byname: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  nameId: string;

  @ApiProperty()
  @Expose()
  @IsArray()
  @Min(3)
  @Max(3)
  badges: number[];

  @ApiProperty()
  @Expose()
  @IsInt()
  nameplate: number;

  @ApiProperty()
  @Expose()
  @IsArray()
  @Min(4)
  @Max(4)
  textColor: number[];

  @ApiProperty()
  @Expose()
  @IsInt()
  uniform: number;

  @ApiProperty()
  @Expose()
  @IsInt()
  bossKillCountsTotal: number;

  @ApiProperty()
  @Expose()
  @IsArray()
  @Min(14)
  @Max(14)
  bossKillCounts: number;

  @ApiProperty()
  @Expose()
  @IsInt()
  @Min(0)
  deadCount: number;

  @ApiProperty()
  @Expose()
  @IsInt()
  @Min(0)
  helpCount: number;

  @ApiProperty()
  @Expose()
  @IsInt()
  @Min(0)
  ikuraNum: number;

  @ApiProperty()
  @Expose()
  @IsInt()
  @Min(0)
  goldenIkuraNum: number;

  @ApiProperty()
  @Expose()
  @IsInt()
  @Min(0)
  goldenIkuraAssistNum: number;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  jobBonus: number | null;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  jobRate: number | null;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  jobScore: number | null;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  kumaPoint: number | null;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  gradeId: number | null;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  gradePoint: number | null;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  smellMeter: number | null;

  @ApiProperty()
  @Expose()
  @IsEnum(Species)
  species: Species;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsInt()
  specialId: number | null;

  @ApiProperty()
  @Expose()
  @IsArray()
  @MinLength(0)
  @MaxLength(5)
  specialCounts: number[];

  @ApiProperty()
  @Expose()
  @IsArray()
  @MinLength(0)
  @MaxLength(5)
  weaponList: number[];

  update(playTime: Date): Prisma.PlayerUpsertArgs {
    return {
      create: this.query,
      update: {
        gradeId: this.gradeId,
        gradePoint: this.gradePoint,
        jobBonus: this.jobBonus,
        jobRate: this.jobRate,
        jobScore: this.jobScore,
        kumaPoint: this.kumaPoint,
        smellMeter: this.smellMeter,
      },
      where: {
        nplnUserId_playTime: {
          nplnUserId: this.nplnUserId,
          playTime: playTime,
        },
      },
    };
  }

  get query(): Prisma.PlayerCreateWithoutResultInput {
    return {
      badges: this.badges,
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
      nameplate: this.nameplate,
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

export class CoopResultCustomRequest {
  @ApiProperty()
  @Expose({ name: "uuid" })
  @IsUUID()
  @Transform((param) => param.value.toString().toUpperCase())
  resultId: string;

  @ApiProperty()
  @Expose()
  @IsDateString()
  @Transform((param) => dayjs(param.value).toDate())
  playTime: Date;

  @ApiProperty()
  @Expose()
  @IsArray()
  @MinLength(0)
  @MaxLength(14)
  bossCounts: number[];

  @ApiProperty()
  @Expose()
  @IsArray()
  @MinLength(0)
  @MaxLength(14)
  bossKillCounts: number[];

  @ApiProperty()
  @Expose()
  @IsInt()
  ikuraNum: number;

  @ApiProperty()
  @Expose()
  @IsInt()
  goldenIkuraNum: number;

  @ApiProperty()
  @Expose()
  @IsInt()
  goldenIkuraAssistNum: number;

  @ApiProperty()
  @Expose()
  @IsBoolean()
  nightLess: boolean;

  @ApiProperty()
  @Expose()
  @IsInt()
  dangerRate: number;

  @ApiProperty()
  @Expose()
  @IsArray()
  @MinLength(1)
  @MaxLength(4)
  members: string[];

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsInt()
  bronze: number | null;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsInt()
  silver: number | null;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsInt()
  gold: number | null;

  @ApiProperty()
  @Expose()
  @IsBoolean()
  isClear: boolean;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsInt()
  failureWave: number | null;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsBoolean()
  isBossDefeated: boolean | null;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsInt()
  bossId: number | null;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsString()
  scenarioCode: string | null;

  @ApiProperty()
  @Expose()
  @Type(() => CoopPlayerCustomRequest)
  @ValidateNested({ each: true })
  players: CoopPlayerCustomRequest[];

  @ApiProperty()
  @Expose()
  @Type(() => CoopWaveCustomRequest)
  @ValidateNested({ each: true })
  waves: CoopWaveCustomRequest[];

  @ApiProperty()
  @Expose()
  @Type(() => CoopScheduleCustomRequest)
  schedule: CoopScheduleCustomRequest;

  private _status: ResultStatus = ResultStatus.UNKNOWN;
  get status(): ResultStatus {
    return this._status;
  }

  get isValid(): boolean {
    return [ResultStatus.FIXED, ResultStatus.VALID, ResultStatus.PRIVATE].includes(this._status);
  }
  // 修正してステータスをセットする
  fix(): void {
    // ブキIDが全員nullだった場合Falseを返す
    if (this.players.every((player) => player.specialId === null)) {
      this._status = ResultStatus.INVALID;
      return;
    }
    // キケン度が0だった場合Falseを返す
    if (this.dangerRate === 0) {
      this._status = ResultStatus.INVALID;
      return;
    }

    // ビッグラン、チームコンテスト、いつものバイト
    if (
      (this.schedule.mode === Mode.REGULAR && this.schedule.rule === Rule.REGULAR) ||
      (this.schedule.mode === Mode.REGULAR && this.schedule.rule === Rule.BIG_RUN) ||
      (this.schedule.mode === Mode.LIMITED && this.schedule.rule === Rule.CONTEST)
    ) {
      // 正しくModeとRuleが設定されていなければ修正する
      if (this.schedule.startTime === null || this.schedule.endTime === null) {
        this.schedule.mode = this.scenarioCode === null ? Mode.PRIVATE_CUSTOM : Mode.PRIVATE_SCENARIO;
        this._status = ResultStatus.FIXED;
        return;
      }

      // チームコンテストではなくオカシラメーターが全員nullだった場合
      if (this.schedule.mode !== Mode.LIMITED && this.players.every((player) => player.smellMeter === null)) {
        this._status = ResultStatus.INVALID;
        return;
      }

      // スペシャルが全員nullだった場合
      if (this.players.every((player) => player.specialId === null)) {
        this._status = ResultStatus.INVALID;
        return;
      }

      // スケジュールからズレていれば修正する、ズレすぎていれば何もしない
      this.playTime = fixedPlayTime(this.playTime, this.schedule);

      if (isValidTime(this.playTime, this.schedule)) {
        this._status = ResultStatus.VALID;
        return;
      }

      // ムニエールのシフトだった場合
      if (
        dayjs(this.schedule.startTime).unix() === dayjs("2022-12-23T16:00:00Z").unix() &&
        dayjs(this.schedule.endTime).unix() === dayjs("2022-12-25T08:00:00Z").unix()
      ) {
        // 2022年のデータであれば更新
        if (dayjs("2022-01-01T00:00:00Z").toDate() <= this.playTime && this.playTime < dayjs("2023-01-01T00:00:00Z").toDate()) {
          // スケジュールとプレイ時間をズラす
          this.schedule.startTime = dayjs("2022-11-19T00:00:00Z").toDate();
          this.schedule.endTime = dayjs("2022-11-20T16:00:00Z").toDate();
          this.playTime = fixedPlayTime(this.playTime, this.schedule);
          this._status = isValidTime(this.playTime, this.schedule) ? ResultStatus.FIXED : ResultStatus.INVALID;
          return;
        }
        // 2023年のデータであれば更新
        if (dayjs("2023-01-01T00:00:00Z").toDate() <= this.playTime && this.playTime < dayjs("2024-01-01T00:00:00Z").toDate()) {
          // スケジュールとプレイ時間をズラす
          this.schedule.startTime = dayjs("2023-04-08T08:00:00Z").toDate();
          this.schedule.endTime = dayjs("2023-04-10T00:00:00Z").toDate();
          this.playTime = fixedPlayTime(this.playTime, this.schedule);
          this._status = isValidTime(this.playTime, this.schedule) ? ResultStatus.FIXED : ResultStatus.INVALID;
          return;
        }
        this._status = ResultStatus.INVALID;
        return;
      }
      this._status = ResultStatus.UNKNOWN;
      return;
    }
    this._status = ResultStatus.PRIVATE;
    return;
  }

  get query(): Prisma.ResultUpsertArgs {
    return {
      create: {
        bossCounts: this.bossCounts,
        bossKillCounts: this.bossKillCounts,
        bronze: this.bronze,
        dangerRate: this.dangerRate,
        failureWave: this.failureWave,
        gold: this.gold,
        goldenIkuraAssistNum: this.goldenIkuraAssistNum,
        goldenIkuraNum: this.goldenIkuraNum,
        ikuraNum: this.ikuraNum,
        isBossDefeated: this.isBossDefeated,
        isClear: this.isClear,
        members: this.members,
        nightLess: this.nightLess,
        playTime: this.playTime,
        players: {
          createMany: {
            data: this.players.map((player) => player.query),
          },
        },
        resultId: this.resultId,
        scenarioCode: this.scenarioCode,
        schedule: {
          connectOrCreate: this.schedule.query,
        },
        silver: this.silver,
        version: "2.1.6",
        waves: {
          createMany: {
            data: this.waves.map((wave) => wave.query),
          },
        },
      },
      update: {},
      where: {
        playTime_resultId: {
          playTime: this.playTime,
          resultId: this.resultId,
        },
      },
    };
  }
}

function fixedPlayTime(playTime: Date, schedule: CoopScheduleCustomRequest): Date {
  if (schedule.startTime < playTime && playTime < schedule.endTime) {
    return playTime;
  }
  if (schedule.startTime < dayjs(playTime).add(9, "hours").toDate() && dayjs(playTime).add(9, "hours").toDate() < schedule.endTime) {
    return dayjs(playTime).add(9, "hours").toDate();
  }
  if (
    schedule.startTime < dayjs(playTime).subtract(9, "hours").toDate() &&
    dayjs(playTime).subtract(9, "hours").toDate() < schedule.endTime
  ) {
    return dayjs(playTime).subtract(9, "hours").toDate();
  }
  return playTime;
}

function isValidTime(playTime: Date, schedule: CoopScheduleCustomRequest) {
  return schedule.startTime <= playTime && playTime <= schedule.endTime;
}
