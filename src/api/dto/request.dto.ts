import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from "class-validator";

import { ToBoolean, ToInteger } from "./decorator";
import { PaginatedRequestDto } from "./pagination.dto";
import { Rule, Mode } from "./splatnet3/coop_history_detail.dto";

export enum OrderKey {
  DESC = "desc",
  ASC = "asc",
}

export enum SortKey {
  SalmonId = "salmonId",
  PlayTime = "playTime",
  GoldenIkuraNum = "goldenIkuraNum",
  IkuraNum = "ikuraNum",
}

export class CoopResultFindManyArgsPaginatedRequest extends PaginatedRequestDto {
  @ApiPropertyOptional({
    default: SortKey.SalmonId,
    description: "ソートする項目",
    enum: SortKey,
  })
  @IsOptional()
  @IsEnum(SortKey)
  sort: SortKey = SortKey.SalmonId;

  @ApiPropertyOptional({
    default: OrderKey.ASC,
    description: "降順または昇順",
    enum: OrderKey,
  })
  @IsOptional()
  @IsEnum(OrderKey)
  order: OrderKey = OrderKey.ASC;

  @ApiPropertyOptional({ description: "プレイヤーID", nullable: true })
  @IsOptional()
  @IsString()
  member: string | null;

  @ApiPropertyOptional({ description: "夜イベントを含むかどうか", nullable: true })
  @ToBoolean()
  nightLess?: boolean | null;

  @ApiPropertyOptional({ description: "最小獲得イクラ数", nullable: true })
  @ToInteger()
  @IsOptional()
  @IsInt()
  ikuraNum?: number | null;

  @ApiPropertyOptional({ description: "最小納品金イクラ数", nullable: true })
  @ToInteger()
  @IsOptional()
  @IsInt()
  goldenIkuraNum?: number | null;

  @ApiPropertyOptional({ description: "クリアしたかどうか", nullable: true })
  @ToBoolean()
  isClear?: boolean | null;

  @ApiPropertyOptional({ description: "オカシラシャケをたおしたかどうか", nullable: true })
  @ToBoolean()
  isBossDefeated?: boolean | null;

  @ApiPropertyOptional({ description: "ステージのID", nullable: true, type: Number })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  stageId?: number | null;

  @ApiPropertyOptional({
    description: "支給されるブキ",
    maxItems: 4,
    minItems: 0,
    nullable: true,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  @ArrayMinSize(2)
  @ArrayMaxSize(4)
  weaponList?: number[] | null;

  @ApiPropertyOptional({
    default: Rule.REGULAR,
    description: "ルール",
    enum: Rule,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(Rule)
  rule: Rule;

  @ApiPropertyOptional({
    default: Mode.REGULAR,
    description: "モード",
    enum: Mode,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(Mode)
  mode: Mode;
}
