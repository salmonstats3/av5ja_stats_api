import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from "class-validator";

import { Mode } from "./enum/mode";
import { Rule } from "./enum/rule";
import { Species } from "./enum/species";

export class CustomCoopScheduleRequest {
  @ApiProperty()
  @IsInt()
  stageId: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  startTime: Date | null;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  endTime: Date | null;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(5)
  weaponList: number[];

  @ApiProperty()
  @IsEnum(Mode)
  mode: Mode;

  @ApiProperty()
  @IsEnum(Rule)
  rule: Rule;

  get query(): Prisma.ScheduleCreateOrConnectWithoutResultsInput {
    return {
      create: {
        endTime: this.endTime,
        mode: this.mode,
        rareWeapon: null,
        rule: this.rule,
        stageId: this.stageId,
        startTime: this.startTime,
        weaponList: this.weaponList,
      },
      where: {
        stageId_mode_rule_weaponList: {
          mode: this.mode,
          rule: this.rule,
          stageId: this.stageId,
          weaponList: this.weaponList,
        },
      },
    };
  }
}

export class CustomCoopPlayerRequest {
  @ApiProperty()
  @IsString()
  readonly nplnUserId: string;

  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsString()
  readonly byname: string;

  @ApiProperty()
  @IsString()
  readonly nameId: string;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @Transform((param) => param.value.map((value: number | null) => value ?? -1))
  readonly badges: number[];

  @ApiProperty()
  @IsInt()
  @Min(0)
  readonly nameplate: number;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  readonly textColor: number[];

  @ApiProperty()
  @IsInt()
  @Min(0)
  readonly uniform: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  readonly bossKillCountsTotal: number;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(14)
  @ArrayMaxSize(14)
  @Transform((param) => param.value.map((value: number | null) => value ?? -1))
  readonly bossKillCounts: number[];

  @ApiProperty()
  @IsInt()
  @Min(0)
  readonly deadCount: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  readonly helpCount: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  readonly ikuraNum: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  readonly goldenIkuraNum: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  readonly goldenIkuraAssistNum: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly jobBonus: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly jobRate: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly jobScore: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly kumaPoint: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly gradeId: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(999)
  readonly gradePoint: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  readonly smellMeter: number | null;

  @ApiProperty()
  @IsEnum(Species)
  readonly species: Species;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(-1)
  readonly specialId: number | null;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(5)
  readonly specialCounts: number[];

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(5)
  readonly weaponList: number[];

  @ApiProperty()
  @IsDateString()
  playTime: Date;

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
      playTime: this.playTime,
      smellMeter: this.smellMeter,
      specialCounts: this.specialCounts,
      specialId: this.specialId,
      species: this.species.toString(),
      textColor: this.textColor,
      uniform: this.uniform,
      weaponList: this.weaponList,
    };
  }
}

export class CustomCoopWaveRequest {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(5)
  readonly waveId: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(8)
  readonly eventType: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(2)
  readonly waterLevel: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly goldenIkuraNum: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  readonly goldenIkuraPopNum: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  @Min(0)
  readonly quotaNum: number;

  @ApiProperty()
  @IsBoolean()
  readonly isClear: boolean;

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

export class CustomCoopResultRequest {
  @ApiProperty()
  @IsUUID()
  @Transform((param) => param.value.toUpperCase())
  uuid: string;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(14)
  @ArrayMaxSize(14)
  bossCounts: number[];

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(14)
  @ArrayMaxSize(14)
  bossKillCounts: number[];

  @ApiProperty()
  @IsInt()
  @Min(0)
  ikuraNum: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  goldenIkuraNum: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  goldenIkuraAssistNum: number;

  @ApiProperty()
  @IsBoolean()
  nightLess: boolean;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(3.33)
  dangerRate: number;

  @ApiProperty()
  @IsDateString()
  playTime: Date;

  @ApiProperty()
  @IsBoolean()
  isClear: boolean;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  failureWave: number | null;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isBossDefeated: boolean | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  bossId: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  bronze: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  silver: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  gold: number | null;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  members: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  scenarioCode: string | null;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CustomCoopScheduleRequest)
  readonly schedule: CustomCoopScheduleRequest;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CustomCoopPlayerRequest)
  readonly players: CustomCoopPlayerRequest[];

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CustomCoopWaveRequest)
  readonly waves: CustomCoopWaveRequest[];

  get isValid(): boolean {
    // プレイヤー全員のスペシャルIDがnullならfalse
    if (this.players.every((player) => player.specialId === null)) {
      return false;
    }

    // キケン度が0ならfalse
    if (this.dangerRate === 0) {
      return false;
    }
    return true;
  }

  get query(): Prisma.ResultUpsertArgs {
    return {
      create: {
        bossCounts: this.bossCounts,
        bossId: this.bossId,
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
            skipDuplicates: true,
          },
        },
        scenarioCode: this.scenarioCode,
        schedule: {
          connectOrCreate: this.schedule.query,
        },
        silver: this.silver,
        uuid: this.uuid,
        waves: {
          createMany: {
            data: this.waves.map((wave) => wave.query),
            skipDuplicates: true,
          },
        },
      },
      update: {},
      where: {
        playTime_uuid: {
          playTime: this.playTime,
          uuid: this.uuid,
        },
      },
    };
  }
}

export class CustomCoopResultManyRequest {
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CustomCoopResultRequest)
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(2000)
  results: CustomCoopResultRequest[];
}
