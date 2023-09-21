import { createHash } from 'crypto';

import { Mode, Rule } from '@prisma/client';
import dayjs from 'dayjs';

import { CoopStageId } from './enum/coop_stage_id';

export function scheduleHash(mode: Mode, rule: Rule, startTime: Date, endTime: Date, stageId: CoopStageId, weaponList: number[]): string {
  return createHash('sha256')
    .update(`${mode}-${rule}-${stageId}-${dayjs(startTime).unix()}-${dayjs(endTime).unix()}-${weaponList.join(',')}`)
    .digest('hex');
}
