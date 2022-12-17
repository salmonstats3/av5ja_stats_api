import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CoopHistoryDetail } from './coop_history_detail.dto';

export class Data {
  @ApiProperty()
  @ValidateNested()
  @Type(() => CoopHistoryDetail)
  coopHistoryDetail: CoopHistoryDetail;
}
