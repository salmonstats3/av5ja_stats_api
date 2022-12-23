import { ApiProperty } from '@nestjs/swagger';
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
import { CoopDataRequest } from './data.dto';
import { Species } from './player.dto';
import { CustomCoopScheduleRequest } from './schedule.dto';

export class CoopResultRequest {
  @ApiProperty({ type: CoopDataRequest })
  @ValidateNested()
  @Type(() => CoopDataRequest)
  data: CoopDataRequest;
}

class CustomCoopTextColorRequest {
  @ApiProperty()
  r: number;
  @ApiProperty()
  g: number;
  @ApiProperty()
  b: number;
  @ApiProperty()
  a: number;
}

class CustomCoopNameBackgroundRequest {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: CustomCoopTextColorRequest })
  textColor: CustomCoopTextColorRequest;
}

class CustomCoopNamePlateRequest {
  @ApiProperty({ type: [Number], maxItems: 3, minItems: 3 })
  badges: (number | null)[];

  @ApiProperty({ type: CustomCoopNameBackgroundRequest })
  background: CustomCoopNameBackgroundRequest;
}

class CustomCoopPlayerRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pid: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  bossKillCountsTotal: number;

  @ApiProperty({ type: [Number], minItems: 14, maxItems: 14 })
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

  @ApiProperty({ type: [Number], minItems: 3, maxItems: 4 })
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(4)
  specialCounts: number[];

  @ApiProperty()
  @IsBoolean()
  isMyself: boolean;

  @ApiProperty({ type: CustomCoopNamePlateRequest })
  @ValidateNested()
  @Type(() => CustomCoopNamePlateRequest)
  nameplate: CustomCoopNamePlateRequest;

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

  @ApiProperty({ type: [Number], minItems: 3, maxItems: 4 })
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

class CustomCoopJobResultRequest {
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

class CustomCoopWaveRequest {
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

export class CustomCoopResultRequest {
  @ApiProperty({ type: CustomCoopScheduleRequest })
  @ValidateNested()
  @Type(() => CustomCoopScheduleRequest)
  schedule: CustomCoopScheduleRequest;

  @ApiProperty({ type: [Number], minItems: 14, maxItems: 14 })
  @ArrayMinSize(14)
  @ArrayMaxSize(14)
  @Transform((param) => param.value.slice(0, -1))
  bossKillCounts: number[];

  @ApiProperty({ type: [Number], minItems: 14, maxItems: 14 })
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

  @ApiProperty({ type: [CustomCoopPlayerRequest] })
  @ValidateNested({ each: true })
  @Type(() => CustomCoopPlayerRequest)
  otherResults: CustomCoopPlayerRequest[];

  @ApiProperty({ type: CustomCoopPlayerRequest })
  @ValidateNested()
  @Type(() => CustomCoopPlayerRequest)
  myResult: CustomCoopPlayerRequest;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ format: 'uuid' })
  @IsString()
  @IsNotEmpty()
  uuid: string;

  @ApiProperty({ type: [CustomCoopWaveRequest] })
  @ValidateNested({ each: true })
  @Type(() => CustomCoopWaveRequest)
  waveDetails: CustomCoopWaveRequest[];

  @ApiProperty()
  @IsInt()
  @Min(0)
  goldenIkuraNum: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(3.33)
  dangerRate: number;

  @ApiProperty({ type: Date })
  @IsDateString()
  playTime: string;

  @ApiProperty()
  @IsInt()
  goldenIkuraAssistNum: number;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  scale: (number | null)[];

  @ApiProperty({ type: CustomCoopJobResultRequest })
  @ValidateNested()
  @Type(() => CustomCoopJobResultRequest)
  jobResult: CustomCoopJobResultRequest;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  smellMeter: number | null;
}
