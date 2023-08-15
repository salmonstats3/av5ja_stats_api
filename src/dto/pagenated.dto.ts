import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsInt, Max, Min, ValidateNested } from 'class-validator';

export class PaginatedRequestDto {
    @Expose()
    @Transform((params) => parseInt(params.value || 0, 10))
    @IsInt()
    @Min(0)
    @ApiProperty({
        default: 0,
        description: 'Offset',
        minimum: 0,
        required: true,
        title: 'offset',
        type: 'integer',
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
        required: true,
        title: 'limit',
        type: 'integer',
    })
    readonly limit: number;
}

export class PaginatedDto<T> {
    @ApiProperty({ description: 'Total', required: true, type: 'integer' })
    total: number;

    @ApiProperty({ description: 'Limit', required: true, type: 'integer' })
    limit: number;

    @ApiProperty({ description: 'Offset', required: true, type: 'integer' })
    offset: number;

    @ApiProperty({ description: 'Entries', required: true, type: 'array' })
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
