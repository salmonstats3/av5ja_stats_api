import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

import { ResultDeprecatedDto } from './result.deprecated.dto';

export class ResultCreateManyRequest {
  @ApiProperty({ deprecated: true, isArray: true, type: ResultDeprecatedDto.CoopResultRequest })
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => ResultDeprecatedDto.CoopResultRequest)
  results: ResultDeprecatedDto.CoopResultRequest[];
}
