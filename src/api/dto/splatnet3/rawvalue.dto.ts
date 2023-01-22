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
  @ApiProperty({
    description: "固有ID",
    example: "20230113T053227_0687f606-9322-4c17-b49f-558b7aab26e1",
  })
  @IsString()
  @IsNotEmpty()
  @Transform((param) => {
    const id: string = Buffer.from(param.value, "base64").toString();
    const regexp = /\d{8}T\d{6}_[a-f0-9\-]{36}/;
    const matches: string[] | null = id.match(regexp);
    if (matches.length === 0 || matches === null) {
      throw new BadRequestException();
    }
    return matches[0];
  })
  id: string;
}
