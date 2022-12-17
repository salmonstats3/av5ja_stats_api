import { BadRequestException, ConsoleLogger } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class IntegerId {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Transform((param) => {
    const rawValue: string = Buffer.from(param.value, 'base64').toString();
    const re: RegExp = new RegExp('([0-9]*)$');

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
    const rawValue: string = Buffer.from(param.value, 'base64').toString();
    return rawValue;
  })
  id: string;
}
