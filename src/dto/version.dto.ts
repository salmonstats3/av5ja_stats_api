import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class Version {
  @ApiProperty({ default: '2.7.0' })
  readonly version: string;

  @ApiProperty({ default: '4.0.0-dae4328c' })
  readonly web_version: string;
}

export class Result {
  @ApiProperty({ default: '2.7.0' })
  @Expose()
  readonly version: string;
}

export class AppVersion {
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => Result)
  @Expose()
  readonly results: Result[];
}
