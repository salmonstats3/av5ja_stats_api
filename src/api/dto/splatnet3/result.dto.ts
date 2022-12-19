import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Data } from './data.dto';
import { Species } from './player.dto';
import { Schedule } from './schedule.dto';

export class Result {
  @ApiProperty()
  @ValidateNested()
  @Type(() => Data)
  data: Data;
}

class TextColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

class Background {
  id: number;
  textColor: TextColor;
}

class NamePlate {
  badges: (number | null)[];
  background: Background;
}

class PlayerResult {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsArray()
  @ArrayMaxSize(14)
  @ArrayMinSize(14)
  @Transform((param) => param.value.slice(0, -1))
  bossKillCounts: number[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  byname: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  bossKillCountsTotal: number;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(4)
  specialCounts: number[];

  @ApiProperty()
  @IsBoolean()
  isMyself: boolean;

  @ApiProperty()
  @ValidateNested()
  @Type(() => NamePlate)
  nameplate: NamePlate;

  @ApiProperty()
  @IsInt()
  specialId: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  helpCount: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  deadCount: number;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(4)
  weaponList: number[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nameId: string;

  @ApiProperty()
  @IsEnum(Species)
  species: Species;

  @ApiProperty()
  @IsInt()
  uniform: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  goldenIkuraNum: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  ikuraNum: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  goldenIkuraAssistNum: number;
}

class JobResult {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isClear: boolean;

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
  failureWave: number | null;
}

class WaveResult {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(4)
  id: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(8)
  eventType: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(35)
  quotaNum: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  goldenIkuraNum: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(2)
  waterLevel: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  goldenIkuraPopNum: number;

  @ApiProperty()
  @IsBoolean()
  isClear: boolean;
}

export class CustomCoopResult {
  @ApiProperty()
  @ValidateNested()
  @Type(() => Schedule)
  schedule: Schedule;

  @ApiProperty()
  @ArrayMinSize(14)
  @ArrayMaxSize(14)
  @Transform((param) => param.value.slice(0, -1))
  bossKillCounts: number[];

  @ApiProperty()
  @ArrayMinSize(14)
  @ArrayMaxSize(14)
  @Transform((param) => param.value.slice(0, -1))
  bossCounts: number[];

  @ApiProperty()
  @IsInt()
  ikuraNum: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(3.25)
  jobRate: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  jobBonus: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  jobScore: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  gradeId: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  gradePoint: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  kumaPoint: number | null;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => PlayerResult)
  otherResults: PlayerResult[];

  @ApiProperty()
  @ValidateNested()
  @Type(() => PlayerResult)
  myResult: PlayerResult;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uuid: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => WaveResult)
  waveDetails: WaveResult[];

  @ApiProperty()
  @IsInt()
  @Min(0)
  goldenIkuraNum: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(3.33)
  dangerRate: number;

  @ApiProperty()
  @IsDateString()
  playTime: string;

  @ApiProperty()
  @IsInt()
  goldenIkuraAssistNum: number;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  scale: (number | null)[];

  @ApiProperty()
  @ValidateNested()
  @Type(() => JobResult)
  jobResult: JobResult;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  smellMeter: number | null;
}
