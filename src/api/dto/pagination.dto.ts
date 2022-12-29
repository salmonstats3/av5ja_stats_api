/**
 * pagination.dto.ts
 * @author SONODA Yudai
 * @date 2020-10-11
 */

import { applyDecorators, Type } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsBoolean, IsDate, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import dayjs from "dayjs";

export class PaginatedRequestDto {
  @Expose()
  @Transform((params) => parseInt(params.value || 0, 10))
  @IsInt()
  @ApiPropertyOptional({
    default: 0,
    description: "オフセット",
    minimum: 0,
    title: "offset",
  })
  readonly offset: number;

  @Expose()
  @Transform((params) => parseInt(params.value || 25, 10))
  @IsInt()
  @ApiPropertyOptional({
    default: 25,
    description: "上限値",
    maximum: 200,
    minimum: 0,
    title: "limit",
  })
  readonly limit: number;
}

export class PaginatedRequestDtoForUser extends PaginatedRequestDto {
  @ApiPropertyOptional({
    description: "ニックネーム",
    title: "nickname",
  })
  @IsString()
  nickname: string;
}

export class PaginatedRequestDtoForWave extends PaginatedRequestDto {
  @ApiProperty({
    default: 0,
    description: "イベントID",
    example: 0,
    title: "",
  })
  @IsInt()
  @Max(6)
  @Min(0)
  event_type: number;

  @ApiProperty({
    default: 0,
    description: "潮位ID",
    example: 0,
    title: "",
  })
  @IsInt()
  @Max(2)
  @Min(0)
  water_level: number;

  @ApiProperty({
    default: 0,
    description: "スケジュールID",
    example: 1655899200,
    title: "",
  })
  @IsInt()
  start_time: number;
}

export class PaginatedRequestDtoForSchedule extends PaginatedRequestDto {
  @ApiProperty({
    default: false,
    description: "未リリースのデータを含むかどうか",
    title: "include_futures",
  })
  @Expose()
  @Transform((params) => {
    if (params.value === undefined) {
      return undefined;
    }
    return params.value === "true";
  })
  @IsOptional()
  @IsBoolean()
  readonly include_futures: boolean;
}

export class PaginatedRequestDtoForResult extends PaginatedRequestDto {
  @ApiPropertyOptional({
    default: false,
    description: "詳細データを含むかどうか",
    title: "",
  })
  @Expose()
  @Transform((params) => {
    if (params.value === undefined) {
      return false;
    }
    return params.value === "true";
  })
  @IsOptional()
  @IsBoolean()
  readonly include_details: boolean;

  @ApiPropertyOptional({
    description: "スケジュールID",
    title: "",
    type: Number,
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
    description: "プレイヤーID",
    title: "",
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
    description: "クリアしたリザルトのみ",
    title: "",
  })
  @Expose()
  @Transform((params) => {
    if (params.value === undefined) {
      return undefined;
    }
    return params.value === "true";
  })
  @IsOptional()
  @IsBoolean()
  readonly is_clear?: boolean;

  @ApiPropertyOptional({
    description: "夜イベントを含まないかどうか",
    title: "",
  })
  @Expose()
  @Transform((params) => {
    if (params.value === undefined) {
      return undefined;
    }
    return params.value === "true";
  })
  @IsOptional()
  @IsBoolean()
  readonly night_less?: boolean;

  @ApiPropertyOptional({
    description: "最小納品金イクラ数",
    title: "",
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
    description: "最小取得赤イクラ数",
    title: "",
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
  @ApiProperty({ description: "総数", type: "integer" })
  total: number;

  @ApiProperty({ description: "上限数", type: "integer" })
  limit: number;

  @ApiProperty({ description: "オフセット", type: "integer" })
  offset: number;

  results: T[];
}

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>({ type: DataDto }) =>
  applyDecorators(
    ApiExtraModels(PaginatedDto, DataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              results: {
                items: { $ref: getSchemaPath(DataDto) },
                type: "array",
              },
            },
          },
        ],
      },
    }),
  );
