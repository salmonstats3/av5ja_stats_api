import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, ValidateNested } from 'class-validator';
import { CustomCoopResult, Result } from './result.dto';

export class ResultRequest {
  @ApiProperty()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => Result)
  results: Result[];
}

export class CustomResultRequest {
  @ApiProperty()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => CustomCoopResult)
  results: CustomCoopResult[];
}
