import { ApiOAuth2, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
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
import * as dayjs from 'dayjs';
import { typeOf } from 'mathjs';

enum Rule {
  REGULAR,
}

enum Species {
  INKLING,
  OCTOLING,
}

class Badge {
  @ApiProperty()
  @IsInt()
  id: number;
  image: Image;
}

class TextColor {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(1)
  r: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(1)
  g: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(1)
  b: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(1)
  a: number;
}

class Image {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;
}

class Background {
  @ApiProperty({ type: TextColor })
  @ValidateNested()
  text_color: TextColor;

  @ApiProperty({ type: Image })
  @ValidateNested()
  image: Image;

  @ApiProperty()
  @IsInt()
  id: number;
}

class NamePlate {
  @ApiProperty({ type: Badge })
  @ValidateNested({ each: true })
  @Type(() => Badge)
  badges: (Badge | null)[];

  @ApiProperty({ type: Background })
  @ValidateNested()
  background: Background;
}

class ImageRef {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Image })
  @ValidateNested()
  image: Image;

  @ApiProperty()
  @IsInt()
  id: number;
}

class Ref {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsInt()
  id: number;
}

class Player {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  is_player: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  byname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name_id: number;

  @ApiProperty({ type: NamePlate })
  @ValidateNested()
  nameplate: NamePlate;

  @ApiProperty({ type: ImageRef })
  @ValidateNested()
  uniform: ImageRef;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsBoolean()
  is_myself: boolean;

  @ApiProperty({ enum: Species })
  @IsEnum(Species)
  species: Species;
}

class PlayerResult {
  @ApiProperty({ type: Player })
  @ValidateNested()
  player: Player;

  @ApiProperty({ type: [ImageRef] })
  @ValidateNested({ each: true })
  @Type(() => ImageRef)
  weapons: ImageRef[];

  @ApiPropertyOptional({ type: ImageRef })
  @IsOptional()
  @ValidateNested()
  special_weapon: ImageRef | null;

  @ApiProperty()
  @IsInt()
  defeat_enemy_count: number;

  @ApiProperty()
  @IsInt()
  deliver_count: number;

  @ApiProperty()
  @IsInt()
  golden_assist_count: number;

  @ApiProperty()
  @IsInt()
  golden_deliver_count: number;

  @ApiProperty()
  @IsInt()
  rescue_count: number;

  @ApiProperty()
  @IsInt()
  rescued_count: number;
}

class BossResult {
  @ApiProperty()
  @IsBoolean()
  has_defeat_boss: boolean;

  @ApiProperty({ type: ImageRef })
  @ValidateNested()
  boss: ImageRef;
}

class EnemyResult {
  @ApiProperty()
  @IsInt()
  defeat_count: number;

  @ApiProperty()
  @IsInt()
  team_defeat_count: number;

  @ApiProperty()
  @IsInt()
  pop_count: number;

  @ApiProperty({ type: ImageRef })
  @ValidateNested()
  enemy: ImageRef;
}

class WaveResult {
  @ApiProperty()
  @IsInt()
  wave_number: number;

  @ApiProperty()
  @IsInt()
  water_level: number;

  @ApiPropertyOptional({ type: Ref })
  @IsOptional()
  @ValidateNested()
  event_wave: Ref | null;

  @ApiProperty()
  @IsInt()
  golden_pop_count: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  deliver_norm: number | null;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  team_deliver_count: number | null;

  @ApiProperty({ type: [Ref] })
  @ValidateNested({ each: true })
  @Type(() => Ref)
  special_weapons: Ref[];
}

class Scale {
  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  gold: number | null;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  silver: number | null;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  bronze: number | null;
}

class HistoryDetailId {
  @ApiProperty()
  @IsString()
  id: string;
}

class CoopHistoryDetail {
  @ApiProperty()
  @IsString()
  typename: string;

  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ enum: Rule })
  @IsEnum(Rule)
  rule: Rule;

  @ApiProperty({ type: PlayerResult })
  @ValidateNested()
  @Type(() => PlayerResult)
  my_result: PlayerResult;

  @ApiProperty({ type: [PlayerResult] })
  @ValidateNested({ each: true })
  @Type(() => PlayerResult)
  member_results: PlayerResult[];

  @ApiProperty({ type: [EnemyResult] })
  @ValidateNested({ each: true })
  @Type(() => EnemyResult)
  enemy_results: [EnemyResult];

  @ApiProperty({ type: [WaveResult] })
  @ValidateNested({ each: true })
  @Type(() => WaveResult)
  wave_results: WaveResult[];

  @ApiProperty()
  @IsInt()
  resultWave: number;

  @ApiProperty()
  @IsDateString()
  played_time: string;

  @ApiProperty({ type: ImageRef })
  @ValidateNested()
  coop_stage: ImageRef;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(3.33)
  danger_rate: number;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageRef)
  weapons: ImageRef[];

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  after_grade: Ref | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  scenario_code: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  smell_meter: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  boss_results: BossResult | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  after_grade_point: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  scale: Scale | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  job_point: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  job_score: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  job_rate: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  job_bonus: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  next_history_detail: HistoryDetailId | null;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  previous_history_detail: HistoryDetailId | null;
}

class Data {
  @ApiProperty({ type: CoopHistoryDetail })
  @ValidateNested()
  coopHistoryDetail: CoopHistoryDetail;
}

class SplatNet3 {
  @ApiProperty({ type: Data })
  @ValidateNested()
  data: Data;
}

export class Results {
  @ApiProperty({
    type: [SplatNet3],
    minItems: 1,
    maxItems: 50,
    description: 'リザルト',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => SplatNet3)
  results: SplatNet3[];
}
