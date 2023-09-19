import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import dayjs from 'dayjs';

export class CoopHistoryDetailId {
  @ApiProperty({ required: true, type: 'string' })
  readonly id: string;

  @ApiProperty({ required: true, type: 'string' })
  readonly prefix: string;

  @ApiProperty({ required: true, type: 'string' })
  readonly nplnUserId: string;

  @ApiProperty({ required: true, type: Date })
  readonly playTime: Date;

  @ApiProperty({ required: true, type: 'string' })
  readonly uuid: string;

  /**
   * オリジナルのリザルトID
   */
  get raw_value(): string {
    // 逆変換時にはJSTからUTCに変換する
    return btoa(
      `${this.id}-${this.prefix}-${this.nplnUserId}:${dayjs(this.playTime).subtract(9, 'hour').format('YYYYMMDDTHHmmss')}_${this.uuid}`,
    );
  }

  constructor(raw_value: string) {
    const regexp = /([\w]*)-([\w]{1})-([\w\d]{20}):([\dT]{15})_([a-f0-9-]{36})/;
    const match = regexp.exec(atob(raw_value));
    if (match !== null) {
      const [, id, prefix, nplnUserId, playTime, uuid] = match;
      this.id = id;
      this.prefix = prefix;
      this.nplnUserId = nplnUserId;
      // JSTのサーバーの時間なので+09:00する
      this.playTime = dayjs(playTime).add(9, 'hour').toDate();
      this.uuid = uuid;
    } else {
      throw new BadRequestException('Invalid CoopHistoryDetailId');
    }
  }
}
