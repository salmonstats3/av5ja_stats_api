import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type, plainToInstance } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { EventType } from 'src/enum/event_type';
import { WaterLevel } from 'src/enum/water_level';

import { CoopScheduleRequest } from './schedules.request.dto';

class ActiveCount {
    @Expose()
    @ApiProperty({ type: 'integer' })
    readonly user: number;

    @Expose()
    @ApiProperty({ type: 'integer' })
    readonly account: number;

    @Expose()
    @ApiProperty({ type: 'integer' })
    readonly result: number;
}

class IkuraNum {
    /**
     * 合計値
     */
    @Expose()
    @ApiProperty({ type: 'integer' })
    readonly sum: number;

    /**
     * 最大値
     */
    @Expose()
    @ApiProperty({ type: 'integer' })
    readonly max: number;

    /**
     * 平均値
     */
    @Expose()
    @ApiProperty({ type: Number })
    @Type(() => Number)
    @Transform(({ value }) => parseFloat(value))
    readonly avg: number;

    // /**
    //  * 分散
    //  */
    // @ApiProperty({ type: Decimal })
    // @Type(() => Decimal)
    // readonly dispersion: Decimal;

    // /**
    //  * 標準偏差
    //  */
    // @ApiProperty({ type: Decimal })
    // @Type(() => Decimal)
    // readonly deviation: Decimal;
}

class GradePoint {
    @Expose()
    @ApiProperty({ maximum: 999, minimum: 0, type: 'integer' })
    readonly grade_point: number;

    @Expose()
    @ApiProperty({ maximum: 8, minimum: 0, type: 'integer' })
    readonly grade_id: number;

    @Expose()
    @ApiProperty({ minimum: 0, type: 'integer' })
    readonly count: number;
}

export class GoldenIkuraResult {
    @Expose()
    @ApiProperty({ minimum: 0, type: 'integer' })
    golden_ikura_num: number;

    @Expose()
    @ApiProperty({ minimum: 0, type: 'integer' })
    count: number;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(response: any): GoldenIkuraResult {
        return plainToInstance(GoldenIkuraResult, response, { excludeExtraneousValues: true });
    }
}

export class GradeResult {
    @Expose()
    grade_id: number;

    @Expose()
    grade_point: number;

    @Expose()
    count: number;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(response: any): GradeResult {
        return plainToInstance(GradeResult, response, { excludeExtraneousValues: true });
    }
}

class Result {
    @Expose()
    @ApiProperty({ type: 'integer' })
    clear: number;

    @Expose()
    @ApiProperty({ type: 'integer' })
    failure: number;

    @Expose()
    @ApiProperty({ isArray: true, type: 'integer' })
    failure_waves: number[];
}

class JobResult extends Result {
    @Expose()
    @ApiProperty({ type: 'integer' })
    boss_count: number;

    @Expose()
    @ApiProperty({ type: 'integer' })
    boss_defeated_count: number;
}

export class WaveResult {
    @Expose()
    @ApiProperty({ enum: WaterLevel })
    water_level: WaterLevel;

    @Expose()
    @ApiProperty({ enum: EventType })
    event_type: EventType;

    @Expose()
    @ApiProperty({ name: 'result', type: Result })
    @Type(() => Result)
    result: Result;

    @Expose()
    @ApiProperty({ name: 'golden_ikura_num', type: IkuraNum })
    @Type(() => IkuraNum)
    golden_ikura_num: IkuraNum;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(response: any): WaveResult {
        return plainToInstance(
            WaveResult,
            {
                event_type: response.event_type,
                golden_ikura_num: {
                    avg: response.avg_golden_ikura,
                    max: response.max_golden_ikura,
                    sum: response.golden_ikura,
                },
                result: {
                    clear: response.clear,
                    failure: response.failure,
                },
                water_level: response.water_level,
            },
            { excludeExtraneousValues: true },
        );
    }
}

export class CoopScheduleStatus {
    @Expose()
    @ApiProperty({ example: '2021-01-01T00:00:00.000Z', type: Date })
    readonly start_time: Date;

    @Expose()
    @ApiProperty({ example: '2021-01-01T00:00:00.000Z', type: Date })
    readonly end_time: Date;

    @Expose()
    @ApiProperty({ name: 'active_count', type: ActiveCount })
    @Type(() => ActiveCount)
    readonly active_count: ActiveCount;

    @Expose()
    @ApiProperty({ name: 'golden_ikura_num', type: IkuraNum })
    @Type(() => IkuraNum)
    readonly golden_ikura_num: IkuraNum;

    @Expose({ name: 'ikura_num' })
    @ApiProperty({ name: 'ikura_num', type: IkuraNum })
    @Type(() => IkuraNum)
    @ValidateNested()
    readonly ikura_num: IkuraNum;

    @ApiProperty({ isArray: true, name: 'grade_point', type: GradePoint })
    @Type(() => GradePoint)
    readonly grade_point: GradePoint[];

    @Expose()
    @ApiProperty({ name: 'result', type: JobResult })
    @Type(() => JobResult)
    readonly result: JobResult;

    @Expose()
    @ApiProperty({ example: [0, 0, 0], isArray: true, type: 'integer' })
    readonly failure_waves: number[];

    static fromJSON(response: CoopScheduleStatsRaw): CoopScheduleStatus {
        return plainToInstance(
            CoopScheduleStatus,
            {
                active_count: {
                    account: 0,
                    result: response.shifts_worked,
                    user: 0,
                },
                end_time: response.end_time,
                golden_ikura_num: {
                    avg: response.avg_golden_ikura_num,
                    max: response.max_golden_ikura_num,
                    sum: response.golden_ikura_num,
                },
                ikura_num: {
                    avg: response.avg_ikura_num,
                    max: response.max_ikura_num,
                    sum: response.ikura_num,
                },
                result: {
                    clear: response.is_clear,
                    failure: response.is_failure,
                    failure_waves: response.failure_waves,
                },
                start_time: response.start_time,
            },
            { excludeExtraneousValues: true },
        );
    }
}

export interface CoopScheduleStatsRaw {
    avg_golden_ikura_num: number;
    avg_ikura_num: number;
    end_time: string;
    failure_waves: number[];
    golden_ikura_num: number;
    grade_point: number;
    ikura_num: number;
    is_clear: number;
    is_failure: number;
    max_golden_ikura_num: number;
    max_ikura_num: number;
    shifts_worked: number;
    start_time: string;
    std_golden_ikura_num: number;
    std_ikura_num: number;
    var_golden_ikura_num: number;
    var_ikura_num: number;
}

export class CoopSchedule extends CoopScheduleRequest { }

export class CoopScheduleStats extends CoopSchedule {
    @Expose()
    @ApiProperty({ name: 'status', type: CoopScheduleStatus })
    @Type(() => CoopScheduleStatus)
    readonly status: CoopScheduleStatus;

    @Expose()
    @ApiProperty({ isArray: true, name: 'entries', type: CoopScheduleStatus })
    @Type(() => CoopScheduleStatus)
    readonly entries: CoopScheduleStatus[];

    @Expose()
    @ApiProperty({ isArray: true, name: 'waves', type: WaveResult })
    @Type(() => WaveResult)
    readonly waves: WaveResult[];

    @Expose()
    @ApiProperty({ isArray: true, name: 'grade_point', type: GradePoint })
    @Type(() => GradePoint)
    readonly grade_point: GradePoint[];

    @Expose()
    @ApiProperty({ isArray: true, name: 'golden_ikura_num', type: GoldenIkuraResult })
    @Type(() => GoldenIkuraResult)
    readonly golden_ikura_num: GoldenIkuraResult[];
}
