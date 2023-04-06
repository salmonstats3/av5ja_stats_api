import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsDecimal,
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
import dayjs from "dayjs";
import { Mode } from "./enum/mode";
import { Rule } from "./enum/rule";
import { Species } from "./enum/species";

export class CustomCoopResultsRequest {
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CustomCoopResultRequest)
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(1000)
  results: CustomCoopResultRequest[];
}

export class CustomCoopResultRequest {
  @ApiProperty()
  @IsUUID()
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
  @Transform((param) => dayjs(param.value).toDate())
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
  @IsBoolean()
  bossId: number | null;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CustomCoopScheduleRequest)
  schedule: CustomCoopScheduleRequest;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CustomCoopPlayerRequest)
  players: CustomCoopPlayerRequest[];

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CustomCoopWaveRequest)
  waves: CustomCoopWaveRequest[];

  get query(): Prisma.ResultCreateArgs {
    return {
      data: {
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
        players: this.players,
        scenarioCode: this.scenarioCode,
        schedule: {
          create: {},
        },
        silver: this.silver,
        uuid: this.uuid,
        waves: this.waves,
      },
    };
  }
}

export class CustomCoopScheduleRequest {
  @ApiProperty()
  @IsInt()
  stageId: number;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(4)
  weaponList: number[];

  @ApiProperty()
  @IsEnum(Mode)
  mode: Mode;

  @ApiProperty()
  @IsEnum(Rule)
  rule: Rule;
}

export class CustomCoopPlayerRequest {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  byname: string;

  @ApiProperty()
  @IsString()
  nameId: string;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  badges: number[];

  @ApiProperty()
  @IsInt()
  @Min(0)
  nameplate: number;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  textColor: number[];

  @ApiProperty()
  @IsInt()
  @Min(0)
  uniform: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  bossKillCountsTotal: number;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(14)
  @ArrayMaxSize(14)
  bossKillCounts: number[];

  @ApiProperty()
  @IsInt()
  @Min(0)
  deadCount: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  helpCount: number;

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
  @IsOptional()
  @IsInt()
  @Min(0)
  jobBonus: number | null;

  @ApiProperty()
  @IsOptional()
  @IsDecimal()
  @Min(0)
  jobRate: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  jobScore: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  kumaPoint: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  gradeId: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  smellMeter: number | null;

  @ApiProperty()
  @IsEnum(Species)
  @Min(0)
  species: Species;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  speciesId: number | null;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  specialCounts: number[];

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  weaponList: number[];
}

export class CustomCoopWaveRequest {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(4)
  waveId: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(8)
  eventType: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(2)
  waterLevel: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  goldenIkuraNum: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  goldenIkuraPopNum: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  quotaNum: number;

  @ApiProperty()
  @IsBoolean()
  isClear: boolean;
}
