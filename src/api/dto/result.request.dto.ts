import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
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
import * as dayjs from 'dayjs';
import { Species } from './splatnet3/player.dto';

enum Rule {
  RULE_PRIVATE,
  RULE_REGULAR,
  RULE_CONTEST,
}

class TextColor {
  @ApiProperty({ description: '赤' })
  @IsNumber()
  @Min(0)
  @Max(1)
  r: number;

  @ApiProperty({ description: '緑' })
  @IsNumber()
  @Min(0)
  @Max(1)
  g: number;

  @ApiProperty({ description: '青' })
  @IsNumber()
  @Min(0)
  @Max(1)
  b: number;

  @ApiProperty({ description: '不透明度' })
  @IsNumber()
  @Min(0)
  @Max(1)
  a: number;
}

class Background {
  @ApiProperty({ description: 'テキストカラー' })
  @Type(() => TextColor)
  @ValidateNested()
  textColor: TextColor;

  @ApiProperty({ description: '背景ID' })
  @IsInt()
  @Min(0)
  background: number;
}

class NamePlate {
  @ApiProperty({ type: [Number], description: 'バッジ' })
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMaxSize(3)
  @ArrayMinSize(3)
  badges: (number | null)[];

  @ApiProperty({ description: '背景' })
  @Type(() => Background)
  @ValidateNested()
  background: Background;
}

class JobResult {
  @ApiProperty({ type: [Number], description: '獲得したウロコ' })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  scale: (number | null)[];

  @ApiPropertyOptional({ description: '失敗したWAVE' })
  @IsOptional()
  @IsInt()
  failure_wave: number | null;

  @ApiProperty({ description: 'クリアしたかどうか' })
  @IsBoolean()
  is_clear: boolean;

  @ApiPropertyOptional({ description: 'バイトボーナス' })
  @IsInt()
  @IsOptional()
  @Max(100)
  @Min(0)
  job_bonus: number | null;

  @ApiPropertyOptional({ description: 'オカシラシャケをたおしたかどうか' })
  @IsOptional()
  @IsBoolean()
  is_boss_defeated: boolean | null;
}

class PlayerResult {
  @ApiProperty({ description: 'ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: '名前' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '称号' })
  @IsString()
  @IsNotEmpty()
  byname: string;

  @ApiProperty({ description: '名前ID' })
  @IsInt()
  @Min(0)
  @Max(9999)
  name_id: number;

  @ApiProperty({ description: 'ネームプレート' })
  @Type(() => NamePlate)
  @ValidateNested()
  nameplate: NamePlate;

  @ApiProperty({ description: '金イクラ納品数' })
  @IsInt()
  @Min(0)
  golden_ikura_num: number;

  @ApiProperty({ description: '金イクラ納品アシスト数' })
  @IsInt()
  @Min(0)
  golden_ikura_assist_num: number;

  @ApiProperty({ description: 'イクラ数' })
  @IsInt()
  @Min(0)
  ikura_num: number;

  @ApiProperty({ description: '被救助数' })
  @IsInt()
  @Min(0)
  dead_count: number;

  @ApiProperty({ description: '救助数' })
  @IsInt()
  @Min(0)
  help_count: number;

  @ApiProperty({ type: [Number], description: '支給ブキリスト' })
  @IsArray()
  @ArrayMaxSize(4)
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  weapon_list: number[];

  @ApiProperty({ description: '支給スペシャル' })
  @IsInt()
  special: number;

  @ApiProperty({ enum: Species, description: '種族' })
  @IsEnum(Species)
  species: Species;

  @ApiProperty({ type: [Number], description: 'スペシャル使用回数' })
  @IsArray()
  @ArrayMaxSize(3)
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  special_counts: number[];

  @ApiProperty({ type: [Number], description: 'オオモノ討伐数' })
  @IsArray()
  @ArrayMinSize(15)
  @ArrayMaxSize(15)
  @ValidateNested({ each: true })
  boss_kill_counts: number[];

  @ApiProperty({ description: 'オオモノ討伐数合計' })
  @IsInt()
  @Min(0)
  @Max(99)
  boss_kill_counts_total: number;
}

class Schedule {
  @ApiProperty({ description: 'ステージID' })
  @IsInt()
  @Min(0)
  @Max(7)
  stage_id: number;

  @ApiPropertyOptional({ description: 'シフト開始時間' })
  @Expose()
  @Transform((param) => dayjs.unix(param.value).toDate())
  @IsDate()
  @IsOptional()
  start_time: Date;

  @ApiPropertyOptional({ description: '終了時間' })
  @Expose()
  @Transform((param) => dayjs.unix(param.value).toDate())
  @IsDate()
  @IsOptional()
  end_time: Date;

  @ApiProperty({ type: [Number], description: '支給ブキリスト' })
  @IsArray()
  @ArrayMaxSize(4)
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  weapon_list: number[];
}

class WaveResult {
  @ApiProperty({ description: 'ID' })
  @IsInt()
  @Min(1)
  @Max(4)
  id: number;

  @ApiProperty({ description: '潮位ID' })
  @IsInt()
  @Min(0)
  @Max(2)
  water_level: number;

  @ApiProperty({ description: 'イベントID' })
  @IsInt()
  @Min(0)
  @Max(8)
  event_type: number;

  @ApiProperty({ description: '金イクラ納品数' })
  @IsInt()
  @Min(0)
  golden_ikura_num: number;

  @ApiProperty({ description: '金イクラ出現数' })
  @IsInt()
  @Min(0)
  golden_ikura_pop_num: number;

  @ApiProperty({ description: 'ノルマ数' })
  @IsInt()
  @Min(0)
  quota_num: number;
}

class UploadResult {
  @ApiProperty({ enum: Rule, description: 'ルール' })
  @IsEnum(Rule)
  rule: Rule;

  @ApiProperty({ type: [Number], description: 'オオモノ出現数' })
  @IsArray()
  @ArrayMaxSize(15)
  @ArrayMinSize(15)
  @ValidateNested()
  boss_counts: number[];

  @ApiProperty({
    type: Number,
    description: 'キケン度',
    maximum: 3.33,
    minimum: 0.0,
  })
  @IsNumber()
  @Max(3.33)
  @Min(0)
  danger_rate: number;

  @ApiProperty({ description: '評価ID' })
  @IsInt()
  @Min(0)
  @Max(8)
  grade_id: number;

  @ApiProperty({ description: 'レート' })
  @IsInt()
  @Max(999)
  @Min(0)
  grade_point: number;

  @ApiProperty({ description: 'バイトID' })
  @IsString()
  job_id: string;

  @ApiPropertyOptional({
    description: '評価レート',
    maximum: 3.25,
    minimum: 0.0,
  })
  @IsOptional()
  @IsNumber()
  @Max(3.25)
  @Min(0)
  job_rate: number | null;

  @ApiProperty({
    description: 'バイトスコア',
  })
  @IsOptional()
  @IsInt()
  job_score: number | null;

  @ApiProperty({ description: 'ジョブスコア' })
  @IsInt()
  kuma_point: number;

  @ApiProperty({ description: 'プレイヤーリザルト' })
  @ValidateNested()
  @Type(() => PlayerResult)
  my_result: PlayerResult;

  @ApiProperty({ type: [PlayerResult], description: 'プレイヤーリザルト' })
  @ValidateNested({ each: true })
  @Type(() => PlayerResult)
  other_results: PlayerResult[];

  @ApiProperty({ description: 'バイトリザルト' })
  @ValidateNested()
  @Type(() => JobResult)
  job_result: JobResult;

  @ApiProperty({ description: 'プレイ時間' })
  @Expose()
  @Transform((param) => dayjs.unix(param.value).toDate())
  @IsDate()
  play_time: Date;

  @ApiProperty({ description: 'シフト開始時間' })
  @Expose()
  @Transform((param) => dayjs.unix(param.value).toDate())
  @IsDate()
  start_time: Date;

  @ApiProperty({ description: 'シフト終了時間' })
  @Expose()
  @Transform((param) => dayjs.unix(param.value).toDate())
  @IsDate()
  end_time: Date;

  @ApiProperty({ description: 'スケジュール' })
  @ValidateNested()
  @Type(() => Schedule)
  schedule: Schedule;

  @ApiProperty({ type: [WaveResult], description: 'WAVEリザルト' })
  @ValidateNested({ each: true })
  @Type(() => WaveResult)
  wave_details: WaveResult[];
}

export class UploadResults {
  @ApiProperty({
    type: [UploadResult],
    minItems: 1,
    maxItems: 50,
    description: 'リザルト',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => UploadResult)
  results: UploadResult[];
}
