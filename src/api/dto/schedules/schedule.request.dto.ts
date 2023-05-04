import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";
import dayjs from "dayjs";

import { Mode } from "../enum/mode";
import { Rule } from "../enum/rule";

export class CoopScheduleRequest {
  @ApiProperty()
  stageId: number;

  @ApiProperty()
  @IsOptional()
  // @IsDateString()
  @Transform((param) => (param.value === null ? null : dayjs(param.value).toDate()))
  startTime: Date | null;

  @ApiProperty()
  @IsOptional()
  // @IsDateString()
  @Transform((param) => (param.value === null ? null : dayjs(param.value).toDate()))
  endTime: Date | null;

  @ApiProperty()
  weaponList: number[];

  @ApiProperty()
  rareWeapon: number | null;

  @ApiProperty()
  @IsEnum(Mode)
  mode: Mode;

  @ApiProperty()
  @IsEnum(Rule)
  rule: Rule;

  get query(): Prisma.ScheduleCreateOrConnectWithoutResultsInput {
    return {
      create: {
        endTime: this.endTime ?? undefined,
        mode: this.mode,
        rule: this.rule,
        stageId: this.stageId,
        startTime: this.startTime ?? undefined,
        weaponList: this.weaponList,
      },
      where: {
        unique: {
          endTime: this.endTime ?? dayjs("1970-01-01T00:00:00.000Z").toDate(),
          mode: this.mode,
          rule: this.rule,
          stageId: this.stageId,
          startTime: this.startTime ?? dayjs("1970-01-01T00:00:00.000Z").toDate(),
          weaponList: this.weaponList,
        },
      },
    };
  }
}
