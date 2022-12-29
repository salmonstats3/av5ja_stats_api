import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, ValidateNested } from "class-validator";

import { IntegerId } from "./rawvalue.dto";

export class BossResult {
  @ApiProperty()
  @IsBoolean()
  hasDefeatBoss: boolean;

  @ApiProperty()
  @ValidateNested()
  @Type(() => IntegerId)
  boss: IntegerId;
}
