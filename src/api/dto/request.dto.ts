import { ParseBoolPipe } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { ToBoolean, ToInteger } from './decorator';
import { PaginatedRequestDto } from './pagination.dto';

export enum OrderKey {
  DESC = 'desc',
  ASC = 'asc',
}

export enum SortKey {
  SalmonId = 'salmonId',
  PlayTime = 'playTime',
  GoldenIkuraNum = 'goldenIkuraNum',
  IkuraNum = 'ikuraNum',
}

export class CoopResultFindManyArgsPaginatedRequest extends PaginatedRequestDto {
  @ApiPropertyOptional({
    enum: SortKey,
    default: SortKey.SalmonId,
  })
  @IsOptional()
  @IsEnum(SortKey)
  sort: SortKey = SortKey.SalmonId;

  @ApiPropertyOptional({
    enum: OrderKey,
    default: OrderKey.ASC,
  })
  @IsOptional()
  @IsEnum(OrderKey)
  order: OrderKey = OrderKey.ASC;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  member: string | null;

  @ApiPropertyOptional({ nullable: true })
  @ToBoolean()
  nightLess?: boolean | null;

  @ApiPropertyOptional({ nullable: true })
  @ToInteger()
  @IsOptional()
  @IsInt()
  ikuraNum?: number | null;

  @ApiPropertyOptional({ nullable: true })
  @ToInteger()
  @IsOptional()
  @IsInt()
  goldenIkuraNum?: number | null;

  @ApiPropertyOptional({ nullable: true })
  @ToBoolean()
  isClear?: boolean | null;

  @ApiPropertyOptional({ nullable: true })
  @ToBoolean()
  isBossDefeated?: boolean | null;
}
