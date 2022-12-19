import { Mode, Rule } from './coop_history_detail.dto';

export class Schedule {
  startTime: number;
  rule: Rule;
  mode: Mode;
  stageId: number;
  weaponList: number[];
}
