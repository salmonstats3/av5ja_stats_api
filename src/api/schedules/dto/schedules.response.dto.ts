import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, Min } from "class-validator";
import { CoopScheduleRequest } from "./schedules.request.dto";

class CoopScheduleStatus {
}

export class CoopScheduleStats {
    readonly status: CoopScheduleStatus
}

export class CoopSchedule extends CoopScheduleRequest {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @Min(0)
    readonly limit: number | null;
}
