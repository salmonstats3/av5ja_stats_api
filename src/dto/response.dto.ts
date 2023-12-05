import { Mode, Prisma, Rule, Species } from '@prisma/client';
import { CoopBossInfoId } from 'src/utils/enum/coop_enemy_id';
import { CoopGradeId } from 'src/utils/enum/coop_grade_id';
import { CoopStageId } from 'src/utils/enum/coop_stage_id';
import { EventId } from 'src/utils/enum/event_wave';
import { WaterLevelId } from 'src/utils/enum/water_level';
import { WeaponInfoMain } from 'src/utils/enum/weapon_info_main';

import { Common } from './common.dto';
import { CoopSkinId } from 'src/utils/enum/coop_skin_id';
import { scheduleHash } from 'src/utils/hash';

export namespace Response {
  export class Schedule {
    readonly id: string;
    readonly startTime: Date | null;
    readonly endTime: Date | null;
    readonly mode: Mode;
    readonly rule: Rule;
    readonly stageId: CoopStageId;
    readonly bossId: CoopBossInfoId | null;
    readonly weaponList: WeaponInfoMain.Id[];

    private get scheduleId(): string {
      return scheduleHash(this.mode, this.rule, this.startTime, this.endTime, this.stageId, this.weaponList);
    }

    get connectOrCreate(): Prisma.ScheduleCreateOrConnectWithoutResultsInput {
      return {
        create: {
          endTime: this.endTime,
          mode: this.mode,
          rule: this.rule,
          scheduleId: this.scheduleId,
          stageId: this.stageId,
          startTime: this.startTime,
          weaponList: this.weaponList,
        },
        where: {
          scheduleId: this.scheduleId,
        },
      };
    }
  }

  export class JobResult {
    readonly failureWave: number | null;
    readonly isClear: boolean;
    readonly bossId: CoopBossInfoId | null;
    readonly isBossDefeated: boolean | null;
  }

  export class TextColor {
    readonly r: number
    readonly g: number
    readonly b: number
    readonly a: number
  }

  export class Background {
    readonly id: number
    readonly textColor: TextColor
  }

  export class NamePlate {
    readonly background: Background
    readonly badges: (number | null)[]
  }

  export class MemberResult {
    readonly id: Common.PlayerId
    readonly goldenIkuraNum: number
    readonly bossKillCounts: number[]
    readonly uniform: CoopSkinId
    readonly bossKillCountsTotal: number
    readonly specialCounts: number[]
    readonly ikuraNum: number
    readonly isMyself: boolean
    readonly nameplate: NamePlate
    readonly nplnUserId: string
    readonly helpCount: number
    readonly deadCount: number
    readonly weaponList: WeaponInfoMain.Id[]
    readonly nameId: string
    readonly goldenIkuraAssistNum: number
    readonly species: Species
    readonly name: string
    readonly byname: string
  }

  export class WaveResult {
    readonly id: number;
    readonly eventType: EventId;
    readonly quotaNum: number;
    readonly goldenIkuraNum: number;
    readonly waterLevel: WaterLevelId;
    readonly goldenIkuraPopNum: number;
    readonly isClear: boolean;
  }

  export class CoopHistory {
    readonly id: Common.ResultId;
    readonly hash: string;
    readonly stageId: CoopStageId;
    readonly weaponList: WeaponInfoMain.Id[];
    readonly gradeId: CoopGradeId | null;
    readonly gradePoint: number | null;
    readonly ikuraNum: number | null;
    readonly goldenIkuraNum: number;
    readonly jobResult: JobResult;
  }

  export class CoopHistoryDetail extends CoopHistory {
    readonly dangerRate: number;
    readonly scale: (number | null)[];
    readonly bossCounts: number[];
    readonly bossKillCounts: number[];
    readonly waveDetails: WaveResult[];
    readonly schedule: Schedule;
    readonly smellMeter: number | null;
    readonly jobBonus: number | null;
    readonly jobScore: number | null;
    readonly kumaPoint: number | null;
    readonly scenarioCode: string | null;
    readonly goldenIkuraAssistNum: number;
    readonly myResult: MemberResult;
    readonly otherResults: MemberResult[];
    readonly playTime: Date;
  }

  export class StageScheduleQuery {
    readonly schedules: Schedule[];
  }

  export class CoopHistoryDetailQuery {
    readonly results: CoopHistoryDetail[];
  }

  export class CoopHistoryNode {
    readonly schedule: Schedule
    readonly results: CoopHistoryDetail[]
  }

  export class CoopHistoryQuery {
    readonly histories: CoopHistoryNode[]
  }
}
