/**
 * pagination.dto.ts
 * @author SONODA Yudai
 * @date 2020-10-11
 */

import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import dayjs from 'dayjs';
import { arrayBuffer } from 'stream/consumers';

export class PaginatedRequestDto {
  @Expose()
  @Transform((params) => parseInt(params.value || 0, 10))
  @IsInt()
  @ApiPropertyOptional({
    title: 'offset',
    minimum: 0,
    default: 0,
    description: 'オフセット',
  })
  readonly offset: number;

  @Expose()
  @Transform((params) => parseInt(params.value || 25, 10))
  @IsInt()
  @ApiPropertyOptional({
    title: 'limit',
    minimum: 0,
    maximum: 200,
    default: 25,
    description: '上限値',
  })
  readonly limit: number;
}

export class PaginatedRequestDtoForUser extends PaginatedRequestDto {
  @ApiPropertyOptional({
    title: 'nickname',
    description: 'ニックネーム',
  })
  @IsString()
  nickname: string;
}

export class PaginatedRequestDtoForWave extends PaginatedRequestDto {
  @ApiProperty({
    title: '',
    default: 0,
    example: 0,
    description: 'イベントID',
  })
  @IsInt()
  @Max(6)
  @Min(0)
  event_type: number;

  @ApiProperty({
    title: '',
    default: 0,
    example: 0,
    description: '潮位ID',
  })
  @IsInt()
  @Max(2)
  @Min(0)
  water_level: number;

  @ApiProperty({
    title: '',
    default: 0,
    example: 1655899200,
    description: 'スケジュールID',
  })
  @IsInt()
  start_time: number;
}

export class PaginatedRequestDtoForSchedule extends PaginatedRequestDto {
  @ApiProperty({
    title: 'include_futures',
    default: false,
    description: '未リリースのデータを含むかどうか',
  })
  @Expose()
  @Transform((params) => {
    if (params.value === undefined) {
      return undefined;
    }
    return params.value === 'true';
  })
  @IsOptional()
  @IsBoolean()
  readonly include_futures: boolean;
}

export class PaginatedRequestDtoForResult extends PaginatedRequestDto {
  @ApiPropertyOptional({
    title: '',
    default: false,
    description: '詳細データを含むかどうか',
  })
  @Expose()
  @Transform((params) => {
    if (params.value === undefined) {
      return false;
    }
    return params.value === 'true';
  })
  @IsOptional()
  @IsBoolean()
  readonly include_details: boolean;

  @ApiPropertyOptional({
    title: '',
    type: Number,
    description: 'スケジュールID',
  })
  @Expose()
  @Transform((params) => {
    if (params.value === undefined) {
      return undefined;
    }
    return dayjs.unix(params.value).toDate();
  })
  @IsOptional()
  @IsDate()
  readonly start_time?: Date;

  @ApiPropertyOptional({
    title: '',
    description: 'プレイヤーID',
  })
  @Expose()
  @Transform((params) => {
    if (params.value === undefined) {
      return undefined;
    }
    return params.value;
  })
  @IsOptional()
  @IsString()
  readonly nsaid?: string;

  @ApiPropertyOptional({
    title: '',
    description: 'クリアしたリザルトのみ',
  })
  @Expose()
  @Transform((params) => {
    if (params.value === undefined) {
      return undefined;
    }
    return params.value === 'true';
  })
  @IsOptional()
  @IsBoolean()
  readonly is_clear?: boolean;

  @ApiPropertyOptional({
    title: '',
    description: '夜イベントを含まないかどうか',
  })
  @Expose()
  @Transform((params) => {
    if (params.value === undefined) {
      return undefined;
    }
    return params.value === 'true';
  })
  @IsOptional()
  @IsBoolean()
  readonly night_less?: boolean;

  @ApiPropertyOptional({
    title: '',
    description: '最小納品金イクラ数',
  })
  @Expose()
  @Transform((params) => {
    if (params.value === undefined) {
      return undefined;
    }
    return parseInt(params.value, 10);
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly golden_ikura_num?: number;

  @ApiPropertyOptional({
    title: '',
    description: '最小取得赤イクラ数',
  })
  @Expose()
  @Transform((params) => {
    if (params.value === undefined) {
      return undefined;
    }
    return parseInt(params.value, 10);
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly ikura_num?: number;
}

export class PaginatedDto<T> {
  @ApiProperty({ type: 'integer', description: '総数' })
  total: number;

  @ApiProperty({ type: 'integer', description: '上限数' })
  limit: number;

  @ApiProperty({ type: 'integer', description: 'オフセット' })
  offset: number;

  results: T[];
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    })
  );
};
