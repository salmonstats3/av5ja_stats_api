import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, ValidateNested } from "class-validator";

import { CoopResultRequest, CustomCoopResultRequest, RealmCoopResultRequest } from "./result.dto";

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
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => CustomCoopResultRequest)
  results: CustomCoopResultRequest[];
}

export class RealmResultRequest {
  @ApiProperty({ type: [RealmCoopResultRequest] })
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => RealmCoopResultRequest)
  results: RealmCoopResultRequest[];
}
