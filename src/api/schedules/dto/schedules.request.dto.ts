import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, MaxLength, MinLength, ValidateNested } from 'class-validator';
import dayjs from 'dayjs';
import { Mode } from 'src/enum/mode';
import { Rule } from 'src/enum/rule';
import { StageId } from 'src/enum/stage';

// export class CoopSchedule {
//     @ApiProperty({ example: [-2, -2, -2, -2], type: [Number] })
//     @IsArray()
//     @Type(() => Number)
//     weaponList: number[];

//     @ApiProperty({ nullable: true })
//     @IsOptional()
//     @IsDateString()
//     startTime: Date | null;

//     @ApiProperty({ nullable: true })
//     @IsOptional()
//     @IsDateString()
//     endTime: Date | null;

//     @ApiProperty({ nullable: true, type: Number })
//     @IsNumber()
//     rareWeapon: number | null;

//     @ApiProperty({ enum: Setting, example: Setting.NORMAL })
//     @IsEnum(Setting)
//     setting: Setting;

//     @ApiProperty({ enum: StageId, example: StageId.Shakeup })
//     @IsEnum(StageId)
//     stageId: StageId;

//     @ApiProperty({ enum: Mode, example: Mode.REGULAR })
//     @IsEnum(Mode)
//     mode: Mode;

//     @ApiProperty({ enum: Rule, example: Rule.REGULAR })
//     @IsEnum(Rule)
//     rule: Rule;
// }

export class CoopScheduleRequest {
    @ApiProperty({ enum: StageId, example: StageId.Shakeup })
    @IsEnum(StageId)
    readonly stageId: StageId;

    @ApiProperty({ example: '2021-01-01T00:00:00.000Z', type: Date })
    @IsOptional()
    @Transform((param) => (param.value === null ? null : dayjs(param.value).toDate()))
    readonly startTime: Date | null;

    @ApiProperty({ example: '2021-01-01T00:00:00.000Z', type: Date })
    @IsOptional()
    @Transform((param) => (param.value === null ? null : dayjs(param.value).toDate()))
    readonly endTime: Date | null;

    @ApiProperty({ example: [-2, -2, -2, -2], type: ['integer'] })
    @IsArray()
    @MinLength(1)
    @MaxLength(4)
    @ValidateNested({ each: true })
    @Type(() => Number)
    readonly weaponList: number[];

    @ApiProperty({ example: null, nullable: true, type: ['integer'] })
    @IsOptional()
    @IsNumber()
    readonly rareWeapon: number | null;

    @ApiProperty({ enum: Mode, example: Rule.REGULAR })
    @IsEnum(Mode)
    readonly mode: Mode;

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
