import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, ValidateNested } from "class-validator";

import { CoopResultRequest, CustomCoopResultRequest } from "./result.dto";

export class ResultRequest {
  @ApiProperty({ type: [CoopResultRequest] })
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => CoopResultRequest)
  results: CoopResultRequest[];
}

export class CustomResultRequest {
  @ApiProperty({ type: [CustomCoopResultRequest] })
  @IsArray()
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => CustomCoopResultRequest)
  results: CustomCoopResultRequest[];
}
