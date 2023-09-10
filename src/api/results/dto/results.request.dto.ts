import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Expose, plainToInstance, Transform, Type } from 'class-transformer';
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsDate,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Length,
    Max,
    MaxLength,
    Min,
    MinLength,
    ValidateNested,
} from 'class-validator';
import dayjs from 'dayjs';
import { CoopScheduleRequest } from 'src/api/schedules/dto/schedules.request.dto';
import { EventType } from 'src/enum/event_type';
import { Mode } from 'src/enum/mode';
import { Species } from 'src/enum/species';
import { WaterLevel } from 'src/enum/water_level';

export class CoopJobRequest {
    @Expose()
    @ApiProperty({ nullable: true, type: 'integer' })
    @IsOptional()
    @IsInt()
    readonly bossId: number | null;

    @Expose()
    @ApiProperty({ nullable: true, type: Boolean })
    @IsOptional()
    @IsBoolean()
    readonly isBossDefeated: boolean | null;

    @Expose()
    @ApiProperty({ nullable: true, type: 'integer' })
    @IsOptional()
    @IsInt()
    readonly failureWave: number | null;

    @Expose()
    @ApiProperty({ type: Boolean })
    @IsBoolean()
    readonly isClear: boolean;
}

export class CoopTextColorRequest {
    @Expose()
    @ApiProperty()
    @IsNumber()
    @Min(0)
    @Max(1)
    readonly r: number;

    @Expose()
    @ApiProperty()
    @IsNumber()
    @Min(0)
    @Max(1)
    readonly g: number;

    @Expose()
    @ApiProperty()
    @IsNumber()
    @Min(0)
    @Max(1)
    readonly b: number;

    @Expose()
    @ApiProperty()
    @IsNumber()
    @Min(0)
    @Max(1)
    readonly a: number;
}

export class CoopBackgroundRequest {
    @Expose()
    @ApiProperty()
    @IsInt()
    readonly id: number;

    @Expose()
    @ApiProperty()
    @ValidateNested({ each: true })
    @Type(() => CoopTextColorRequest)
    readonly textColor: CoopTextColorRequest;
}

export class CoopNameplateRequest {
    @Expose()
    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(3)
    @ArrayMaxSize(3)
    @Type(() => Number)
    @Transform((param) => param.value.map((value: number) => (value === null ? -1 : value)))
    readonly badges: number[];

    @Expose()
    @ApiProperty()
    @ValidateNested({ each: true })
    @Type(() => CoopBackgroundRequest)
    readonly background: CoopBackgroundRequest;
}

export class CoopResultIdRequest {
    @Expose()
    @ApiProperty()
    @IsString()
    @MinLength(20)
    @MaxLength(20)
    readonly nplnUserId: string;

    @Expose()
    @ApiProperty()
    @IsDate()
    @Transform((param) => dayjs(param.value).toDate())
    readonly playTime: Date;

    @Expose()
    @ApiProperty()
    @IsUUID()
    @Transform((param) => param.value)
    readonly uuid: string;
}

export class CoopPlayerRequest {
    @Expose()
    @ApiProperty()
    @IsArray()
    @ArrayMinSize(14)
    @ArrayMaxSize(14)
    @Type(() => Number)
    readonly bossKillCounts: number[];

    @Expose()
    @ApiProperty()
    @IsString()
    readonly name: string;

    @Expose()
    @ApiProperty()
    @IsString()
    readonly byname: string;

    @Expose()
    @ApiProperty()
    @IsInt()
    @Min(0)
    readonly bossKillCountsTotal: number;

    @Expose()
    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(0)
    @ArrayMaxSize(5)
    @Type(() => Number)
    readonly specialCounts: number[];

    @Expose()
    @ApiProperty()
    @IsInt()
    @Min(0)
    readonly ikuraNum: number;

    @Expose()
    @ApiProperty()
    @IsBoolean()
    readonly isMyself: boolean;

    @Expose()
    @ApiProperty()
    @ValidateNested({ each: true })
    @Type(() => CoopNameplateRequest)
    readonly nameplate: CoopNameplateRequest;

    @Expose()
    @ApiProperty()
    @IsString()
    @Length(20, 20)
    readonly nplnUserId: string;

    @Expose()
    @ApiProperty()
    @IsInt()
    @Min(0)
    readonly helpCount: number;

    @Expose()
    @ApiProperty()
    @IsInt()
    @Min(0)
    readonly deadCount: number;

    @Expose()
    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(0)
    @ArrayMaxSize(5)
    @Type(() => Number)
    readonly weaponList: number[];

    @Expose()
    @ApiProperty()
    @IsString()
    readonly nameId: string;

    @Expose()
    @ApiProperty()
    @IsInt()
    @Min(0)
    readonly goldenIkuraAssistNum: number;

    @Expose()
    @ApiProperty()
    @IsEnum(Species)
    readonly species: Species;

    @Expose()
    @ApiProperty()
    @IsOptional()
    @IsInt()
    @Min(0)
    readonly specialId: number | null;

    @Expose()
    @ApiProperty()
    @IsInt()
    @Min(0)
    readonly goldenIkuraNum: number;

    @Expose()
    @ApiProperty()
    @IsInt()
    @Min(0)
    readonly uniform: number;

    readonly smellMeter: number | null;

    readonly jobBonus: number | null;

    readonly jobScore: number | null;

    readonly jobRate: number | null;

    readonly gradeId: number | null;

    readonly gradePoint: number | null;

    readonly kumaPoint: number | null;

    static fromJSON(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result: any,
        smellMeter: number | null = null,
        jobScore: number | null = null,
        jobRate: number | null = null,
        jobBonus: number | null = null,
        gradeId: number | null = null,
        gradePoint: number | null = null,
        kumaPoint: number | null = null,
    ): CoopPlayerRequest {
        const player: CoopPlayerRequest = plainToInstance(
            CoopPlayerRequest,
            {
                ...result,
                ...{
                    gradeId: gradeId,
                    gradePoint: gradePoint,
                    jobBonus: jobBonus,
                    jobRate: jobRate,
                    jobScore: jobScore,
                    kumaPoint: kumaPoint,
                    smellMeter: smellMeter,
                },
            },
            {
                excludeExtraneousValues: true,
            },
        );
        return player;
    }

    get textColor(): number[] {
        return Object.values(this.nameplate.background.textColor);
    }

    get query(): Prisma.PlayerCreateWithoutResultInput {
        return {
            badges: this.nameplate.badges,
            bossKillCounts: this.bossKillCounts,
            bossKillCountsTotal: this.bossKillCountsTotal,
            byname: this.byname,
            deadCount: this.deadCount,
            goldenIkuraAssistNum: this.goldenIkuraAssistNum,
            goldenIkuraNum: this.goldenIkuraNum,
            gradeId: this.gradeId,
            gradePoint: this.gradePoint,
            helpCount: this.helpCount,
            ikuraNum: this.ikuraNum,
            jobBonus: this.jobBonus,
            jobRate: this.jobRate,
            jobScore: this.jobScore,
            kumaPoint: this.kumaPoint,
            name: this.name,
            nameId: this.nameId,
            nameplate: this.nameplate.background.id,
            nplnUserId: this.nplnUserId,
            smellMeter: this.smellMeter,
            specialCounts: this.specialCounts,
            specialId: this.specialId,
            species: this.species,
            textColor: this.textColor,
            uniform: this.uniform,
            weaponList: this.weaponList,
        };
    }
}

export class CoopWaveRequest {
    @Expose({ name: 'id' })
    @ApiProperty({ name: 'id' })
    @IsInt()
    @Min(1)
    @Max(5)
    @Transform((param) => param.obj.id)
    readonly waveId: number;

    @Expose()
    @ApiProperty({ enum: EventType })
    @IsEnum(EventType)
    readonly eventType: EventType;

    @Expose()
    @ApiProperty()
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(35)
    readonly quotaNum: number | null;

    @Expose()
    @ApiProperty()
    @IsOptional()
    @IsInt()
    @Min(0)
    readonly goldenIkuraNum: number | null;

    @Expose()
    @ApiProperty({ enum: WaterLevel })
    @IsEnum(WaterLevel)
    readonly waterLevel: WaterLevel;

    @Expose()
    @ApiProperty()
    @IsOptional()
    @IsInt()
    @Min(0)
    readonly goldenIkuraPopNum: number;

    @Expose()
    @ApiProperty()
    @IsBoolean()
    readonly isClear: boolean;

    get query(): Prisma.WaveCreateWithoutResultInput {
        return {
            eventType: this.eventType,
            goldenIkuraNum: this.goldenIkuraNum,
            goldenIkuraPopNum: this.goldenIkuraPopNum,
            isClear: this.isClear,
            quotaNum: this.quotaNum,
            waterLevel: this.waterLevel,
            waveId: this.waveId,
        };
    }
}

export class CoopResultRequest {
    @Expose()
    @ApiProperty({ example: 999, minimum: 0, nullable: true, type: 'integer' })
    @IsOptional()
    @IsInt()
    readonly jobBonus: number | null;

    @Expose()
    @ApiProperty({ example: 8, maximum: 8, minimum: 0, nullable: true, type: 'integer' })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(8)
    readonly gradeId: number | null;

    @Expose()
    @ApiProperty({ isArray: true, maxItems: 5, minItems: 1, type: CoopWaveRequest })
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(0)
    @ArrayMaxSize(5)
    @ValidateNested({ each: true })
    @Type(() => CoopWaveRequest)
    readonly waveDetails: CoopWaveRequest[];

    @Expose()
    @ApiProperty({ example: 1000, minimum: 0, type: 'integer' })
    @IsInt()
    @Min(0)
    readonly ikuraNum: number;

    @Expose()
    @ApiProperty({ example: 999, minimum: 0, nullable: true, type: 'integer' })
    @IsOptional()
    @IsInt()
    @Min(0)
    readonly jobScore: number | null;

    @Expose()
    @ApiProperty({ example: 999, minimum: 0, nullable: true, type: 'integer' })
    @IsOptional()
    @IsInt()
    @Min(0)
    readonly kumaPoint: number | null;

    @Expose()
    @ApiProperty({ example: 3.25, maximum: 3.25, minimum: 0, type: Number })
    @IsOptional()
    @IsNumber()
    @Min(0)
    readonly jobRate: number | null;

    @Expose()
    @ApiProperty({ example: 999, type: 'integer' })
    @IsInt()
    @Min(0)
    readonly goldenIkuraNum: number;

    @Expose()
    @ApiProperty({ type: CoopScheduleRequest })
    @ValidateNested({ each: true })
    @Type(() => CoopScheduleRequest)
    readonly schedule: CoopScheduleRequest;

    @Expose()
    @ApiProperty({ type: CoopJobRequest })
    @ValidateNested({ each: true })
    @Type(() => CoopJobRequest)
    readonly jobResult: CoopJobRequest;

    @Expose()
    @ApiProperty({ example: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], maxItems: 14, minItems: 14, type: [Number] })
    @IsArray()
    @ArrayMinSize(14)
    @ArrayMaxSize(14)
    @Type(() => Number)
    readonly bossKillCounts: number[];

    @Expose({ name: 'id' })
    @ApiProperty({ type: CoopResultIdRequest })
    @ValidateNested({ each: true })
    @Type(() => CoopResultIdRequest)
    @Transform((param) => param.obj.id)
    readonly resultId: CoopResultIdRequest;

    @Expose()
    @ApiProperty({ example: [0, 0, 0], maxItems: 3, minItems: 3, type: ['integer'] })
    @Type(() => Number)
    readonly scale: number[];

    @Expose()
    @ApiProperty({ example: 5, maximum: 5, minimum: 0, nullable: true, type: 'integer' })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(5)
    readonly smellMeter: number | null;

    @Expose()
    @ApiProperty({ example: 99, minimum: 0 })
    @IsInt()
    @Min(0)
    readonly goldenIkuraAssistNum: number;

    @Expose()
    @ApiProperty({ example: 999, maximum: 999, minimum: 0, nullable: true })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(999)
    readonly gradePoint: number | null;

    @Expose()
    @ApiProperty({ example: 3.33, maximum: 3.33, minimum: 0 })
    @IsNumber()
    @Min(0)
    @Max(3.33)
    readonly dangerRate: number;

    @Expose()
    @ApiProperty()
    @Type(() => CoopPlayerRequest)
    @ValidateNested({ each: true })
    @Transform((param) => {
        const smellMeter: number | null = param.obj.smellMeter;
        const gradeId: number | null = param.obj.gradeId;
        const gradePoint: number | null = param.obj.gradePoint;
        const jobRate: number | null = param.obj.jobRate;
        const jobScore: number | null = param.obj.jobScore;
        const jobBonus: number | null = param.obj.jobBonus;
        const kumaPoint: number | null = param.obj.kumaPoint;
        return CoopPlayerRequest.fromJSON(param.value, smellMeter, jobScore, jobRate, jobBonus, gradeId, gradePoint, kumaPoint);
    })
    readonly myResult: CoopPlayerRequest;

    @Expose()
    @ApiProperty({ example: null, nullable: true })
    @IsOptional()
    @IsString()
    readonly scenarioCode: string | null;

    @Expose()
    @ApiProperty({ example: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], maxItems: 14, minItems: 14, type: ['integer'] })
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(14)
    @ArrayMaxSize(14)
    @Type(() => Number)
    readonly bossCounts: number[];

    @Expose()
    @ApiProperty({ maxItems: 3, minItems: 1, type: [CoopPlayerRequest] })
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    @ArrayMaxSize(3)
    @ValidateNested({ each: true })
    @Type(() => CoopPlayerRequest)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Transform((param) => param.value.map((player: any) => CoopPlayerRequest.fromJSON(player)))
    readonly otherResults: CoopPlayerRequest[];

    /**
     * 全てのWAVEのeventTypeが0なら夜なし
     */
    get nightLess(): boolean {
        return this.waveDetails.every((wave) => wave.eventType === 0);
    }

    /**
     * メンバー一覧
     */
    get members(): string[] {
        return this.otherResults
            .concat(this.myResult)
            .map((player) => player.nplnUserId)
            .sort();
    }

    /**
     * 有効なリザルトかどうかをチェック
     */
    get isValid(): boolean {
        const currentTime: Date = new Date();
        /**
         * 1. キケン度が0
         * 2. いつものバイトでオカシラメーターがnull
         * 3. 全てのプレイヤーのスペシャルIDがnull
         * 4. 失敗WAVEが-1(回線落ち)
         * 5. プレイ時間が現在時刻より未来
         * 6. いつものバイトでプレイ時刻がスケジュールの範囲内でない
         */
        if (
            this.dangerRate === 0 ||
            (this.smellMeter === null && this.schedule.mode === Mode.REGULAR) ||
            this.otherResults.concat(this.myResult).every((player) => player.specialId === null) ||
            this.jobResult.failureWave === -1 ||
            this.resultId.playTime >= currentTime ||
            (this.schedule.mode === Mode.REGULAR &&
                (this.schedule.startTime > this.resultId.playTime || this.schedule.endTime < this.resultId.playTime))
        ) {
            return false;
        }
        return true;
    }

    query(): Prisma.ResultUpsertArgs {
        return {
            create: {
                bossCounts: this.bossCounts,
                bossId: this.jobResult.bossId,
                bossKillCounts: this.bossKillCounts,
                bronze: this.scale[0],
                dangerRate: this.dangerRate,
                failureWave: this.jobResult.failureWave,
                gold: this.scale[2],
                goldenIkuraAssistNum: this.goldenIkuraAssistNum,
                goldenIkuraNum: this.goldenIkuraNum,
                id: this.resultId.uuid,
                ikuraNum: this.ikuraNum,
                isBossDefeated: this.jobResult.isBossDefeated,
                isClear: this.jobResult.isClear,
                members: this.members,
                nightLess: this.nightLess,
                playTime: this.resultId.playTime,
                players: {
                    createMany: {
                        data: this.otherResults.concat(this.myResult).map((player) => player.query),
                    },
                },
                scenarioCode: this.scenarioCode,
                schedule: {
                    connectOrCreate: this.schedule.query,
                },
                silver: this.scale[1],
                waves: {
                    createMany: {
                        data: this.waveDetails.map((wave) => wave.query),
                    },
                },
            },
            update: {
                players: {
                    update: {
                        data: {
                            bossKillCounts: this.myResult.bossKillCounts,
                            gradeId: this.myResult.gradeId,
                            gradePoint: this.myResult.gradePoint,
                            jobBonus: this.myResult.jobBonus,
                            jobRate: this.myResult.jobRate,
                            jobScore: this.myResult.jobScore,
                            kumaPoint: this.myResult.kumaPoint,
                            smellMeter: this.myResult.smellMeter,
                        },
                        where: {
                            nplnUserId_playTime: {
                                nplnUserId: this.myResult.nplnUserId,
                                playTime: this.resultId.playTime,
                            },
                        },
                    },
                },
            },
            where: {
                id_playTime: {
                    id: this.resultId.uuid,
                    playTime: this.resultId.playTime,
                },
            },
        };
    }
}

export class CoopResultManyRequest {
    @Expose()
    @ApiProperty({ isArray: true, type: CoopResultRequest })
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    @ArrayMaxSize(200)
    @ValidateNested({ each: true })
    @Type(() => CoopResultRequest)
    readonly results: CoopResultRequest[];
}
