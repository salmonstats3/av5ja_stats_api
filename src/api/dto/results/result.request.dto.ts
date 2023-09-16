import { ApiProperty } from "@nestjs/swagger";
import { Client, Prisma } from "@prisma/client";
import { Expose, plainToClass, Transform, Type } from "class-transformer";
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
} from "class-validator";
import dayjs from "dayjs";

import { EventType } from "../enum/event_type";
import { Mode } from "../enum/mode";
import { Species } from "../enum/species";
import { WaterLevel } from "../enum/water_level";
import { CoopScheduleRequest } from "../schedules/schedule.request.dto";

export class CoopJobRequest {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  readonly bossId: number | null;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly isBossDefeated: boolean | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  readonly failureWave: number | null;

  @ApiProperty()
  @IsBoolean()
  readonly isClear: boolean;
}

export class CoopTextColorRequest {
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

export class CoopBackgroundRequest {
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

export class CoopNameplateRequest {
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

export class CoopResultIdRequest {
  @ApiProperty()
  @IsString()
  @MinLength(20)
  @MaxLength(20)
  readonly nplnUserId: string;

  @ApiProperty()
  @IsDate()
  @Transform((param) => dayjs(param.value).toDate())
  readonly playTime: Date;

  @ApiProperty()
  @IsUUID()
  @Transform((param) => param.value)
  readonly uuid: string;
}

export class CoopPlayerRequest {
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

  smellMeter: number | null;

  jobBonus: number | null;

  jobScore: number | null;

  jobRate: number | null;

  gradeId: number | null;

  gradePoint: number | null;

  kumaPoint: number | null;

  static fromJSON(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: any,
    smellMeter: number | null = null,
    jobScore: number | null = null,
    jobRate: number | null = null,
    jobBonus: number | null = null,
    gradeId: number | null = null,
    gradePoint: number | null = null,
    kumaPoint: number | null = null,
  ): CoopPlayerRequest {
    const player: CoopPlayerRequest = plainToClass(CoopPlayerRequest, result, {
      excludeExtraneousValues: true,
    });
    player.smellMeter = smellMeter;
    player.jobScore = jobScore;
    player.jobBonus = jobBonus;
    player.jobRate = jobRate;
    player.gradeId = gradeId;
    player.gradePoint = gradePoint;
    player.kumaPoint = kumaPoint;
    return player;
  }

  get textColor(): number[] {
    return Object.values(this.nameplate.background.textColor);
  }

  get query(): Prisma.PlayerCreateWithoutResultInput {
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
  @ApiProperty({ name: "id" })
  @Expose({ name: "id" })
  @IsInt()
  @Min(1)
  @Max(5)
  waveId: number;

  @ApiProperty({ enum: EventType })
  @IsEnum(EventType)
  eventType: EventType;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(35)
  quotaNum: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  goldenIkuraNum: number | null;

  @ApiProperty({ enum: WaterLevel })
  @IsEnum(WaterLevel)
  waterLevel: WaterLevel;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  goldenIkuraPopNum: number;

  @ApiProperty()
  @IsBoolean()
  isClear: boolean;

  get query(): Prisma.WaveCreateWithoutResultInput {
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
  @IsOptional()
  @IsInt()
  jobBonus: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(8)
  gradeId: number | null;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(0)
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => CoopWaveRequest)
  waveDetails: CoopWaveRequest[];

  @ApiProperty()
  @IsInt()
  @Min(0)
  ikuraNum: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  jobScore: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  kumaPoint: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  jobRate: number | null;

  @ApiProperty()
  @IsInt()
  @Min(0)
  goldenIkuraNum: number;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CoopScheduleRequest)
  schedule: CoopScheduleRequest;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CoopJobRequest)
  jobResult: CoopJobRequest;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(14)
  @ArrayMaxSize(14)
  @Type(() => Number)
  bossKillCounts: number[];

  @Expose({ name: "id" })
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CoopResultIdRequest)
  resultId: CoopResultIdRequest;

  @ApiProperty()
  @Type(() => Number)
  scale: number[];

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  smellMeter: number | null;

  @ApiProperty()
  @IsInt()
  @Min(0)
  goldenIkuraAssistNum: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(999)
  gradePoint: number | null;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(3.33)
  dangerRate: number;

  @ApiProperty()
  @Type(() => CoopPlayerRequest)
  @ValidateNested({ each: true })
  @Transform((param) => {
    const smellMeter: number | null = param.obj.smellMeter;
    const gradeId: number | null = param.obj.gradeId;
    const gradePoint: number | null = param.obj.gradePoint;
    const jobRate: number | null = param.obj.jobRate;
    const jobScore: number | null = param.obj.jobScore;
    const jobBonus: number | null = param.obj.jobBonus;
    const kumaPoint: number | null = param.obj.kumaPoint;
    return CoopPlayerRequest.fromJSON(param.value, smellMeter, jobScore, jobRate, jobBonus, gradeId, gradePoint, kumaPoint);
  })
  myResult: CoopPlayerRequest;

  @ApiProperty()
  @IsOptional()
  @IsString()
  scenarioCode: string | null;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(14)
  @ArrayMaxSize(14)
  @Type(() => Number)
  bossCounts: number[];

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @Type(() => CoopPlayerRequest)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Transform((param) => param.value.map((player: any) => CoopPlayerRequest.fromJSON(player)))
  otherResults: CoopPlayerRequest[];

  /**
   * 全てのWAVEのeventTypeが0なら夜なし
   */
  get nightLess(): boolean {
    return this.waveDetails.every((wave) => wave.eventType === 0);
  }

  /**
   * メンバー一覧
   */
  get members(): string[] {
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

  query(version: string, client: Client): Prisma.ResultUpsertArgs {
    return {
      create: {
        bossCounts: this.bossCounts,
        bossId: this.jobResult.bossId,
        bossKillCounts: this.bossKillCounts,
        bronze: this.scale[0],
        createdBy: client,
        dangerRate: this.dangerRate,
        failureWave: this.jobResult.failureWave,
        gold: this.scale[2],
        goldenIkuraAssistNum: this.goldenIkuraAssistNum,
        goldenIkuraNum: this.goldenIkuraNum,
        id: this.resultId.uuid,
        ikuraNum: this.ikuraNum,
        isBossDefeated: this.jobResult.isBossDefeated,
        isClear: this.jobResult.isClear,
        members: this.members,
        nightLess: this.nightLess,
        playTime: this.resultId.playTime,
        players: {
          createMany: {
            data: this.otherResults.concat(this.myResult).map((player) => player.query),
          },
        },
        scenarioCode: this.scenarioCode,
        schedule: {
          connectOrCreate: this.schedule.query,
        },
        silver: this.scale[1],
        version: version,
        waves: {
          createMany: {
            data: this.waveDetails.map((wave) => wave.query),
          },
        },
      },
      update: {
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
              nplnUserId_playTime: {
                nplnUserId: this.myResult.nplnUserId,
                playTime: this.resultId.playTime,
              },
            },
          },
        },
      },
      where: {
        id_playTime: {
          id: this.resultId.uuid,
          playTime: this.resultId.playTime,
        },
      },
    };
  }
}

export class CoopResultManyRequest {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => CoopResultRequest)
  results: CoopResultRequest[];
}
