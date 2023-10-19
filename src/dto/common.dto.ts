import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, plainToInstance } from 'class-transformer';
import dayjs from 'dayjs';

export namespace Common {
  export class ResultId {
    @ApiProperty({ required: true, type: 'string' })
    @Expose()
    readonly type: string;

    @ApiProperty({ required: true, type: 'string' })
    readonly prefix: string;

    @ApiProperty({ required: true, type: 'string' })
    @Expose()
    readonly nplnUserId: string;

    @ApiProperty({ required: true, type: Date })
    @Expose()
    @Transform(({ value }) => dayjs(value).toISOString())
    readonly playTime: Date;

    @ApiProperty({ required: true, type: 'string' })
    @Expose()
    @Transform(({ value }) => value.toUpperCase())
    readonly uuid: string;

    /**
     * オリジナルのリザルトID
     */
    get rawValue(): string {
      // 逆変換時にはJSTからUTCに変換する
      return btoa(
        `${this.type}-${this.prefix}-${this.nplnUserId}:${dayjs(this.playTime).subtract(9, 'hour').format('YYYYMMDDTHHmmss')}_${this.uuid}`,
      );
    }

    static from(rawValue: string): ResultId {
      const regexp = /([\w]*)-([\w]{1})-([\w\d]{20}):([\dT]{15})_([a-f0-9-]{36})/;
      const match = regexp.exec(atob(rawValue));
      if (match !== null) {
        const [, type, prefix, nplnUserId, playTime, uuid] = match;
        return plainToInstance(ResultId, {
          nplnUserId: nplnUserId,
          playTime: dayjs(playTime).add(9, 'hour').toDate(),
          prefix: prefix,
          type: type,
          uuid: uuid,
        });
      } else {
        throw new BadRequestException('Invalid Common.ResultId');
      }
    }
  }

  export class PlayerId {
    @ApiProperty({ required: true, type: 'string' })
    @Expose()
    readonly id: string;

    readonly prefix: string;

    @ApiProperty({ required: true, type: 'string' })
    @Expose()
    readonly nplnUserId: string;

    @ApiProperty({ required: true, type: 'string' })
    @Expose()
    readonly playTime: Date;

    @ApiProperty({ required: true, type: 'string' })
    @Expose()
    readonly uuid: string;

    readonly suffix: string;

    readonly hostNplnUserId: string;

    /**
     * オリジナルのリザルトID
     */
    get rawValue(): string {
      // 逆変換時にはJSTからUTCに変換する
      return btoa(
        `${this.id}-${this.prefix}-${this.hostNplnUserId}:${dayjs(this.playTime).subtract(9, 'hour').format('YYYYMMDDTHHmmss')}_${
          this.uuid
        }:${this.suffix}-${this.nplnUserId}`,
      );
    }

    get rawId(): string {
      const playTime: string = dayjs(this.playTime).subtract(9, 'hour').format('YYYYMMDDTHHmmss');
      return `${playTime}:${this.nplnUserId}`;
    }

    get isMyself(): boolean {
      return this.nplnUserId === this.hostNplnUserId;
    }

    constructor(rawValue: string) {
      const regexp = /([\w]*)-([\w]{1})-([\w\d]{20}):([\dT]{15})_([a-f0-9-]{36}):([\w]{1})-([\w\d]{20})/;
      const match = regexp.exec(atob(rawValue));
      if (match !== null) {
        const [, id, prefix, hostNplnUserId, playTime, uuid, suffix, nplnUserId] = match;
        this.id = id;
        this.prefix = prefix;
        this.nplnUserId = nplnUserId;
        // JSTのサーバーの時間なので+09:00する
        this.playTime = dayjs(playTime).add(9, 'hour').toDate();
        this.uuid = uuid;
        this.suffix = suffix;
        this.hostNplnUserId = hostNplnUserId;
      }
    }
  }
}
