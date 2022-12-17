import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, ValidateNested } from 'class-validator';
import { IntegerId } from './rawvalue.dto';

export class EnemyResult {
  @ApiProperty()
  @IsInt()
  @Min(0)
  defeatCount: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  teamDefeatCount: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  popCount: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => IntegerId)
  enemy: IntegerId;

  constructor(enemy: EnemyResult | undefined, id: number) {
    this.defeatCount = enemy?.defeatCount ?? 0;
    this.teamDefeatCount = enemy?.teamDefeatCount ?? 0;
    this.popCount = enemy?.popCount ?? 0;
    this.enemy = new IntegerId();
    this.enemy.id = enemy?.enemy.id ?? id;
  }
}
