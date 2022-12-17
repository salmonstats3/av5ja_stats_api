import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min, ValidateNested } from 'class-validator';
import { IntegerId } from './rawvalue.dto';

export class WaveResult {
  @ApiProperty()
  @IsInt()
  waveNumber: number;

  @ApiProperty()
  @IsInt()
  waterLevel: number;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => IntegerId)
  eventWave: IntegerId | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  deliverNorm: number | null;

  @ApiProperty()
  @IsInt()
  goldenPopCount: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  teamDeliverCount: number | null;

  @ApiProperty()
  @ValidateNested()
  @Type(() => IntegerId)
  specialWeapons: IntegerId;
}
