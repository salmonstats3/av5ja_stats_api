import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, MaxLength, MinLength, ValidateNested } from "class-validator";
import dayjs from "dayjs";
import { Mode } from "src/enum/mode";
import { Rule } from "src/enum/rule";

export class CoopScheduleRequestQuery {
  @ApiProperty()
  @IsOptional()
  @IsEnum(Mode)
  @Transform((param) => (param.value === null ? null : param.value))
  mode: Mode | null;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Rule)
  rule: Rule | null;
}

export class CoopScheduleRequest {
  @ApiProperty({ example: 1 })
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

  @ApiProperty({ example: [-2, -2, -2, -2] })
  @IsArray()
  @MinLength(1)
  @MaxLength(4)
  @ValidateNested({ each: true })
  @Type(() => Number)
  weaponList: number[];

  @ApiProperty({ example: null, nullable: true })
  @IsOptional()
  @IsNumber()
  rareWeapon: number | null;

  @ApiProperty({ enum: Mode, example: Rule.REGULAR })
  @IsEnum(Mode)
  mode: Mode;

  @ApiProperty({ enum: Rule, example: Rule.REGULAR })
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
