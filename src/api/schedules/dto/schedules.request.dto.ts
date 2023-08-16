import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsNumber, IsOptional, MaxLength, MinLength, ValidateNested } from 'class-validator';
import dayjs from 'dayjs';
import { Mode } from 'src/enum/mode';
import { Rule } from 'src/enum/rule';
import { StageId } from 'src/enum/stage';

export class CoopScheduleRequest {
    @Expose({ name: 'stageId' })
    @ApiProperty({ enum: StageId, example: StageId.Shakeup })
    @IsEnum(StageId)
    readonly stageId: StageId;

    @Expose({ name: 'startTime' })
    @ApiProperty({ example: '2021-01-01T00:00:00.000Z', type: Date })
    @IsOptional()
    @Transform((param) => (param.value === null ? null : dayjs(param.value).toDate()))
    readonly startTime: Date | null;

    @Expose({ name: 'endTime' })
    @ApiProperty({ example: '2021-01-01T00:00:00.000Z', type: Date })
    @IsOptional()
    @Transform((param) => (param.value === null ? null : dayjs(param.value).toDate()))
    readonly endTime: Date | null;

    @Expose({ name: 'weaponList' })
    @ApiProperty({ example: [-2, -2, -2, -2], isArray: true, type: 'integer' })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(4)
    @Type(() => Number)
    @Transform((param) => param.value)
    readonly weaponList: number[];

    @Expose({ name: 'rareWeapon' })
    @ApiProperty({ example: null, nullable: true, type: 'integer' })
    @IsOptional()
    @IsNumber()
    readonly rareWeapon: number | null;

    @Expose()
    @ApiProperty({ enum: Mode, example: Rule.REGULAR })
    @IsEnum(Mode)
    readonly mode: Mode;

    @Expose()
    @ApiProperty({ enum: Rule, example: Rule.REGULAR })
    @IsEnum(Rule)
    readonly rule: Rule;

    get query(): Prisma.ScheduleCreateOrConnectWithoutResultsInput {
        return {
            create: {
                endTime: this.endTime ?? undefined,
                mode: this.mode,
                rule: this.rule,
                stageId: this.stageId,
                startTime: this.startTime ?? undefined,
                weaponList: this.weaponList,
            },
            where: {
                unique: {
                    endTime: this.endTime ?? dayjs('1970-01-01T00:00:00.000Z').toDate(),
                    mode: this.mode,
                    rule: this.rule,
                    stageId: this.stageId,
                    startTime: this.startTime ?? dayjs('1970-01-01T00:00:00.000Z').toDate(),
                    weaponList: this.weaponList,
                },
            },
        };
    }
}
