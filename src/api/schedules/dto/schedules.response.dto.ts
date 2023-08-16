import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type, plainToInstance } from 'class-transformer';
import { ValidateNested } from 'class-validator';

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
    @ApiProperty({ maximum: 999, minimum: 0, type: 'integer' })
    readonly grade_point: number;

    @ApiProperty({ maximum: 8, minimum: 0, type: 'integer' })
    readonly grade_id: number;

    @ApiProperty({ minimum: 0, type: 'integer' })
    readonly count: number;
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
    @ApiProperty({ type: 'integer' })
    readonly is_clear: number;

    @Expose()
    @ApiProperty({ type: 'integer' })
    readonly is_failure: number;

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

export class CoopSchedule extends CoopScheduleRequest {}

export class CoopScheduleStats extends CoopSchedule {
    @Expose()
    @ApiProperty({ name: 'status', type: CoopScheduleStatus })
    @Type(() => CoopScheduleStatus)
    status: CoopScheduleStatus;

    @Expose()
    @ApiProperty({ isArray: true, name: 'entries', type: CoopScheduleStatus })
    @Type(() => CoopScheduleStatus)
    readonly entries: CoopScheduleStatus[];
}
