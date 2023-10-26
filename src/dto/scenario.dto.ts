import { ApiProperty } from '@nestjs/swagger';
import { CoopEnemyInfoId } from 'src/utils/enum/coop_enemy_id';

export class Scenario {
  @ApiProperty()
  readonly scenarioCode: string;

  @ApiProperty({ type: Number })
  readonly stageId: number;

  @ApiProperty()
  readonly playCount: number;

  // @ApiProperty({ isArray: true, type: CoopResultQuery.WaveResult })
  // readonly waveDetails: CoopResultQuery.WaveResult[];

  @ApiProperty({ type: Number })
  readonly goldenIkuraNum: number;

  @ApiProperty({ type: Number })
  readonly ikuraNum: number;

  @ApiProperty({ type: Number })
  readonly dangerRate: number;

  @ApiProperty({ type: Boolean })
  readonly nightLess: boolean;

  @ApiProperty({ enum: CoopEnemyInfoId })
  readonly bossId: CoopEnemyInfoId;
}
