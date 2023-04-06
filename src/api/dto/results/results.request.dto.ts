import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, ValidateNested } from "class-validator";

import { CoopResultRequest } from "./result.request.dto";

export class CoopResultManyRequest {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => CoopResultRequest)
  results: CoopResultRequest[];
}
