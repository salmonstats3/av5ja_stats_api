import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, ValidateNested } from 'class-validator';
import { IntegerId } from './rawvalue.dto';

export class BossResult {
  @ApiProperty()
  @IsBoolean()
  hasDefeatBoss: boolean;

  @ApiProperty()
  @ValidateNested()
  @Type(() => IntegerId)
  boss: IntegerId;
}
