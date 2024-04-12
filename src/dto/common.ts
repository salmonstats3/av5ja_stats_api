import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { IsUUID } from 'class-validator'
import dayjs from 'dayjs'

import { playerHash, resultHash } from '@/utils/hash'

/**
 * TODO: 既存コードのコピーなので修正予定
 */
export namespace Common {
  export class ResultId {
    @ApiProperty({ required: true, type: 'string' })
    @Expose()
    readonly type: string

    @ApiProperty({ required: true, type: 'string' })
    @Expose()
    readonly prefix: string

    @ApiProperty({ required: true, type: 'string' })
    @Expose()
    readonly nplnUserId: string

    @ApiProperty({ required: true, type: Date })
    @Expose()
    @Transform(({ value }) => dayjs(value).utc().toDate())
    readonly playTime: Date

    @ApiProperty({ required: true, type: 'uuid' })
    @Expose()
    @IsUUID()
    @Transform(({ value }) => value.toUpperCase())
    readonly uuid: string

    /**
     * オリジナルのリザルトID
     */
    get rawValue(): string {
      return btoa(
        `${this.type}-${this.prefix}-${this.nplnUserId}:${dayjs(this.playTime).utc().format('YYYYMMDDTHHmmss')}_${this.uuid.toLowerCase()}`,
      )
    }

    get hash(): string {
      return resultHash(this.uuid, this.playTime)
    }

    static from(rawValue: string): ResultId {
      const regexp = /([\w]*)-([\w]{1})-([\w\d]{20}):([\dT]{15})_([a-f0-9-]{36})/
      const match = regexp.exec(atob(rawValue))
      if (match !== null) {
        const [, type, prefix, nplnUserId, playTime, uuid] = match
        return plainToInstance(
          ResultId,
          {
            nplnUserId: nplnUserId,
            playTime: dayjs(playTime).utc().toDate(),
            prefix: prefix,
            type: type,
            uuid: uuid,
          },
          { excludeExtraneousValues: true },
        )
      } else {
        throw new BadRequestException('Invalid Common.ResultId')
      }
    }
  }

  export class PlayerId {
    @ApiProperty({
      description: 'Base64 encoded string.',
      required: true,
      type: 'string',
    })
    @Expose()
    readonly id: string

    readonly prefix: string

    @ApiProperty({ required: true, type: 'string' })
    @Expose()
    readonly nplnUserId: string

    @ApiProperty({ required: true, type: 'string' })
    @Expose()
    readonly playTime: Date

    @ApiProperty({ required: true, type: 'string' })
    @Expose()
    readonly uuid: string

    readonly suffix: string

    readonly hostNplnUserId: string

    /**
     * オリジナルのリザルトID
     */
    get rawValue(): string {
      // 逆変換時にはJSTからUTCに変換する
      return btoa(
        `${this.id}-${this.prefix}-${this.hostNplnUserId}:${dayjs(this.playTime).utc().format('YYYYMMDDTHHmmss')}_${this.uuid}:${this.suffix}-${
          this.nplnUserId
        }`,
      )
    }

    get hash(): string {
      return playerHash(this.uuid, this.playTime, this.nplnUserId)
    }

    get rawId(): string {
      const playTime: string = dayjs(this.playTime).utc().format('YYYYMMDDTHHmmss')
      return `${playTime}:${this.nplnUserId}`
    }

    get isMyself(): boolean {
      return this.nplnUserId === this.hostNplnUserId
    }

    constructor(rawValue: string) {
      const regexp = /([\w]*)-([\w]{1})-([\w\d]{20}):([\dT]{15})_([a-f0-9-]{36}):([\w]{1})-([\w\d]{20})/
      const match = regexp.exec(atob(rawValue))
      if (match !== null) {
        const [, id, prefix, hostNplnUserId, playTime, uuid, suffix, nplnUserId] = match
        this.id = id
        this.prefix = prefix
        this.nplnUserId = nplnUserId
        this.playTime = dayjs(playTime).toDate()
        this.uuid = uuid
        this.suffix = suffix
        this.hostNplnUserId = hostNplnUserId
      }
    }
  }
}
