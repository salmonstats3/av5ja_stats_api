import { createHash } from 'crypto';

import { Mode, Rule } from '@prisma/client';
import dayjs from 'dayjs';

import { CoopStageId } from './enum/coop_stage_id';

export function scheduleHash(mode: Mode, rule: Rule, startTime: Date, endTime: Date, stageId: CoopStageId, weaponList: number[]): string {
  return createHash('md5')
    .update(`${mode}-${rule}-${stageId}-${dayjs(startTime).unix()}-${dayjs(endTime).unix()}-${weaponList.join(',')}`)
    .digest('hex');
}

export function resultHash(uuid: string, playTime: Date): string {
  return createHash('md5')
    .update(`${uuid.toLowerCase()}-${dayjs(playTime).unix()}`)
    .digest('hex');
}
