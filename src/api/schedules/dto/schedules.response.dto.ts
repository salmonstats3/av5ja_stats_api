import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, Min } from "class-validator";
import { CoopScheduleRequest } from "./schedules.request.dto";
import { Type } from "class-transformer";

class ActiveCount {
    @ApiProperty({ type: 'integer' })
    readonly user: number

    @ApiProperty({ type: 'integer' })
    readonly account: number

    @ApiProperty({ type: 'integer' })
    readonly result: number
}

class IkuraNum {
    /**
     * 最大値
     */
    @ApiProperty({ type: 'integer' })
    readonly maximum: number

    /**
     * 平均値
     */
    @ApiProperty({ type: Number })
    readonly average: number

    /**
     * 分散
     */
    @ApiProperty({ type: Number })
    readonly dispersion: number

    /**
     * 標準偏差
     */
    @ApiProperty({ type: Number })
    readonly deviation: number
}

class GradePoint {
    @ApiProperty({ type: 'integer', minimum: 0, maximum: 999 })
    readonly grade_point: number

    @ApiProperty({ type: 'integer', minimum: 0, maximum: 8 })
    readonly grade_id: number

    @ApiProperty({ type: 'integer', minimum: 0 })
    readonly count: number
}

class CoopScheduleStatus {
    @ApiProperty({ type: Date, example: '2021-01-01T00:00:00.000Z' })
    readonly start_time: Date

    @ApiProperty({ type: Date, example: '2021-01-01T00:00:00.000Z' })
    readonly end_time: Date

    @ApiProperty({ type: ActiveCount })
    @Type(() => ActiveCount)
    readonly active_count: ActiveCount

    @ApiProperty({ type: IkuraNum })
    @Type(() => IkuraNum)
    readonly golden_ikura_num: IkuraNum

    @ApiProperty({ type: IkuraNum })
    @Type(() => IkuraNum)
    readonly ikura_num: IkuraNum

    @ApiProperty({ type: [GradePoint] })
    @Type(() => GradePoint)
    readonly grade_point: GradePoint[]
}

export class CoopScheduleStats {
    @ApiProperty({ type: CoopScheduleStatus })
    @Type(() => CoopScheduleStatus)
    readonly status: CoopScheduleStatus

    @ApiProperty({ type: [CoopScheduleStatus] })
    @Type(() => CoopScheduleStatus)
    readonly history: CoopScheduleStatus[]
}

export class CoopSchedule extends CoopScheduleRequest {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @Min(0)
    readonly limit: number | null;
}
