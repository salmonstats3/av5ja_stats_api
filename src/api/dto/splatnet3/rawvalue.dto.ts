import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class IntegerId {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Transform((param) => {
    const rawValue: string = Buffer.from(param.value, "base64").toString();
    const re = new RegExp("([0-9]*)$");

    if (!re.test(rawValue)) {
      throw new BadRequestException();
    }
    return parseInt(rawValue.match(re)[0], 10);
  })
  id: number;
}

export class StringId {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform((param) => {
    return Buffer.from(param.value, "base64").toString();
  })
  id: string;
}
