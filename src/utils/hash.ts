import { createHash } from 'crypto'

import dayjs from 'dayjs'

import { CoopMode } from '@/enum/coop_mode'
import { CoopRule } from '@/enum/coop_rule'
import { CoopStageId } from '@/enum/coop_stage'

export function scheduleHash(
  mode: CoopMode,
  rule: CoopRule,
  startTime: Date | null,
  endTime: Date | null,
  stageId: CoopStageId,
  weaponList: number[],
): string {
  return startTime === null || endTime === null
    ? createHash('md5')
        .update(`${mode}-${rule}-${stageId}-${weaponList.join(',')}`)
        .digest('hex')
    : createHash('md5')
        .update(
          `${mode}-${rule}-${stageId}-${dayjs(startTime).utc().unix()}-${dayjs(endTime).utc().unix()}-${weaponList.join(',')}`,
        )
        .digest('hex')
}

export function resultHash(uuid: string, playTime: Date): string {
  return createHash('md5')
    .update(`${dayjs(playTime).utc().unix()}-${uuid.toLowerCase()}`)
    .digest('hex')
}

export function playerHash(uuid: string, playTime: Date, nplnUserId: string): string {
  return createHash('md5')
    .update(`${dayjs(playTime).utc().unix()}-${uuid.toLowerCase()}-${nplnUserId}`)
    .digest('hex')
}

export function waveHash(uuid: string, playTime: Date, id: number): string {
  return createHash('md5')
    .update(`${dayjs(playTime).unix()}-${uuid.toLowerCase()}-${id}`)
    .digest('hex')
}
