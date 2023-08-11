import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsInt, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';

export class PaginatedRequestDto {
    @Expose()
    @Transform((params) => parseInt(params.value || 0, 10))
    @IsInt()
    @Min(0)
    @ApiProperty({
        default: 0,
        description: 'Offset',
        minimum: 0,
        title: 'offset',
        type: 'integer',
        required: true
    })
    readonly offset: number;

    @Expose()
    @Transform((params) => parseInt(params.value || 25, 10))
    @IsInt()
    @Min(1)
    @Max(1000)
    @ApiProperty({
        default: 25,
        description: 'Limit',
        maximum: 200,
        minimum: 0,
        title: 'limit',
        type: 'integer',
        required: true
    })
    readonly limit: number;
}

export class PaginatedDto<T> {
    @ApiProperty({ description: 'Total', type: 'integer', required: true })
    total: number;

    @ApiProperty({ description: 'Limit', type: 'integer', required: true })
    limit: number;

    @ApiProperty({ description: 'Offset', type: 'integer', required: true })
    offset: number;

    @ApiProperty({ description: 'Entries', type: 'array', required: true })
    @ValidateNested({ each: true })
    results: T[];

    constructor(limit: number, offset: number, total: number, results: T[]) {
        this.limit = limit;
        this.offset = offset;
        this.total = total;
        this.results = results;
    }
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
                                type: 'array',
                            },
                        },
                    },
                ],
            },
        }),
    );
