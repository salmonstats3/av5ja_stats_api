import { ApiProperty } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { ValidateNested } from "class-validator"

export class Version {
  @ApiProperty({ example: "2.9.0" })
  readonly version: string

  @ApiProperty({ example: "6.0.0-eb33aadc" })
  readonly web_version: string
}

export class VersionV3 {
  @ApiProperty({ example: "2.9.0" })
  readonly version: string

  @ApiProperty({ example: "6.0.0-eb33aadc" })
  readonly revision: string
}

export class Result {
  @ApiProperty({ example: "2.9.0" })
  @Expose()
  readonly version: string
}

export class AppVersion {
  @ApiProperty()
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => Result)
  readonly results: Result[]
}
