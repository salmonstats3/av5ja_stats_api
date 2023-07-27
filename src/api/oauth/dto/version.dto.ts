import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";

export class AppVersionResponse {
    @ApiProperty()
    @Expose()
    @ValidateNested({ each: true })
    @Type(() => AppVersionResult)
    results: AppVersionResult[];
}

export class AppVersionResult {
    @ApiProperty({ example: "2.5.0" })
    @Expose()
    version: string;
}