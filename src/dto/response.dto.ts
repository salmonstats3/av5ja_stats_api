import { Mode, Prisma, Rule, Species } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { CoopBossInfoId } from 'src/utils/enum/coop_enemy_id';
import { CoopGradeId } from 'src/utils/enum/coop_grade_id';
import { CoopSkinId } from 'src/utils/enum/coop_skin_id';
import { CoopStageId } from 'src/utils/enum/coop_stage_id';
import { EventId } from 'src/utils/enum/event_wave';
import { WaterLevelId } from 'src/utils/enum/water_level';
import { WeaponInfoMain } from 'src/utils/enum/weapon_info_main';
import { WeaponInfoSpecial } from 'src/utils/enum/weapon_info_special';
import { scheduleHash, waveHash } from 'src/utils/hash';

import { Common } from './common.dto';
import { CoopHistoryDetailQuery } from './history.detail.request.dto';

export namespace Response {
  export class Schedule {
    @Expose()
    @Transform(({ obj }) => scheduleHash(obj.mode, obj.rule, obj.startTime, obj.endTime, obj.stageId, obj.weaponList))
    readonly id: string;

    @Expose()
    readonly startTime: Date | null;

    @Expose()
    readonly endTime: Date | null;

    @Expose()
    @Transform(({ value }) => (value === undefined ? Mode.REGULAR : value))
    readonly mode: Mode;

    @Expose()
    @Transform(({ value }) => (value === undefined ? Rule.REGULAR : value))
    readonly rule: Rule;

    @Expose()
    readonly stageId: CoopStageId;

    @Expose()
    readonly bossId: CoopBossInfoId | null;

    @Expose()
    readonly weaponList: WeaponInfoMain.Id[];

    @Expose()
    readonly rareWeapons: WeaponInfoMain.Id[];

    // private get scheduleId(): string {
    //   return scheduleHash(this.mode, this.rule, this.startTime, this.endTime, this.stageId, this.weaponList);
    // }

    get connectOrCreate(): Prisma.ScheduleCreateOrConnectWithoutResultsInput {
      return {
        create: {
          endTime: this.endTime,
          mode: this.mode,
          rareWeapons: this.rareWeapons,
          rule: this.rule,
          scheduleId: this.id,
          stageId: this.stageId,
          startTime: this.startTime,
          weaponList: this.weaponList,
        },
        where: {
          scheduleId: this.id,
        },
      };
    }
  }

  export class JobResult {
    readonly failureWave: number | null;
    readonly isClear: boolean;
    readonly bossId: CoopBossInfoId | null;
    readonly isBossDefeated: boolean | null;

    constructor(result: CoopHistoryDetailQuery.CoopHistoryDetail) {
      this.failureWave = result.failureWave;
      this.isClear = result.isClear;
      this.bossId = result.bossId;
      this.isBossDefeated = result.isBossDefeated;
    }
  }

  export class TextColor {
    readonly r: number;
    readonly g: number;
    readonly b: number;
    readonly a: number;

    constructor(r: number, g: number, b: number, a: number) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    }
  }

  export class Background {
    readonly id: number;
    readonly textColor: TextColor;

    constructor(id: number, textColor: TextColor) {
      this.id = id;
      this.textColor = textColor;
    }
  }

  export class NamePlate {
    readonly background: Background;
    readonly badges: (number | null)[];

    constructor(background: number, badges: (number | null)[], textColor: TextColor) {
      this.background = new Background(background, textColor);
      this.badges = badges;
    }
  }

  export class MemberResult {
    readonly hash: string;
    readonly id: Common.PlayerId;
    readonly goldenIkuraNum: number;
    readonly bossKillCounts: number[];
    readonly uniform: CoopSkinId;
    readonly bossKillCountsTotal: number;
    readonly specialCounts: number[];
    readonly ikuraNum: number;
    readonly isMyself: boolean;
    readonly nameplate: NamePlate;
    readonly nplnUserId: string;
    readonly helpCount: number;
    readonly deadCount: number;
    readonly weaponList: WeaponInfoMain.Id[];
    readonly nameId: string;
    readonly goldenIkuraAssistNum: number;
    readonly species: Species;
    readonly name: string;
    readonly byname: string;
    readonly specialId: WeaponInfoSpecial.Id;

    // 追加
    readonly gradeId: CoopGradeId | null;
    readonly gradePoint: number | null;
    readonly smellMeter: number | null;
    readonly jobBonus: number | null;
    readonly jobScore: number | null;
    readonly kumaPoint: number | null;
    readonly jobRate: number | null;

    constructor(
      result: CoopHistoryDetailQuery.MemberResult,
      counts: number[],
      bossKillCounts: number[],
      gradeId: CoopGradeId | null,
      gradePoint: number | null,
      smellMeter: number | null,
      jobBonus: number | null,
      jobScore: number | null,
      kumaPoint: number | null,
      jobRate: number | null,
    ) {
      this.id = result.player.id;
      this.hash = result.player.id.hash;
      this.goldenIkuraNum = result.goldenIkuraNum;
      this.bossKillCounts = result.isMyself ? bossKillCounts : Array.from({ length: 14 }, () => null);
      this.uniform = result.player.uniform.id;
      this.bossKillCountsTotal = result.bossKillCountsTotal;
      this.specialCounts = counts;
      this.specialId = result.specialWeapon.id;
      this.ikuraNum = result.ikuraNum;
      this.isMyself = result.isMyself;
      this.nameplate = new NamePlate(
        result.background,
        result.badges,
        new TextColor(result.textColor[0], result.textColor[1], result.textColor[2], result.textColor[3]),
      );
      this.nplnUserId = result.nplnUserId;
      this.helpCount = result.helpCount;
      this.deadCount = result.deadCount;
      this.weaponList = result.weaponList;
      this.nameId = result.player.nameId;
      this.goldenIkuraAssistNum = result.goldenIkuraAssistNum;
      this.species = result.player.species;
      this.name = result.player.name;
      this.byname = result.player.byname;
      this.gradeId = this.isMyself ? gradeId : null;
      this.gradePoint = this.isMyself ? gradePoint : null;
      this.smellMeter = this.isMyself ? smellMeter : null;
      this.jobBonus = this.isMyself ? jobBonus : null;
      this.jobScore = this.isMyself ? jobScore : null;
      this.kumaPoint = this.isMyself ? kumaPoint : null;
      this.jobRate = this.isMyself ? jobRate : null;
    }
  }

  export class WaveResult {
    readonly hash: string;
    readonly id: number;
    readonly eventType: EventId;
    readonly quotaNum: number;
    readonly goldenIkuraNum: number;
    readonly waterLevel: WaterLevelId;
    readonly goldenIkuraPopNum: number;
    readonly isClear: boolean;

    constructor(result: CoopHistoryDetailQuery.WaveResult, id: Common.ResultId, resultWave: number, bossDefeated: boolean | null) {
      this.hash = waveHash(id.uuid, id.playTime, result.id);
      this.id = result.id;
      this.eventType = result.eventType;
      this.quotaNum = result.quotaNum;
      this.goldenIkuraNum = result.goldenIkuraNum;
      this.waterLevel = result.waterLevel;
      this.goldenIkuraNum = result.goldenIkuraNum;
      this.goldenIkuraPopNum = result.goldenIkuraPopNum;
      this.isClear = bossDefeated !== null ? (result.quotaNum === null ? bossDefeated : true) : !(result.id == resultWave);
    }
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

  export class CoopHistoryDetail {
    readonly id: Common.ResultId;
    readonly hash: string;
    readonly ikuraNum: number | null;
    readonly goldenIkuraNum: number;
    readonly jobResult: JobResult;
    readonly dangerRate: number;
    readonly scale: (number | null)[];
    readonly bossCounts: number[];
    readonly bossKillCounts: number[];
    readonly waveDetails: WaveResult[];
    readonly schedule: Schedule;
    readonly scenarioCode: string | null;
    readonly goldenIkuraAssistNum: number;
    readonly playTime: Date;
    readonly members: MemberResult[];

    constructor(result: CoopHistoryDetailQuery.CoopHistoryDetail, schedule: Schedule) {
      const specialCounts: WeaponInfoSpecial.Id[][] = result.waveResults.map((wave) => wave.specialWeapons.map((special) => special.id));
      this.hash = result.id.hash;
      this.bossCounts = result.bossCounts;
      this.bossKillCounts = result.teamBossKillCounts;
      this.dangerRate = result.dangerRate;
      this.goldenIkuraAssistNum = result.goldenIkuraAssistNum;
      this.goldenIkuraNum = result.goldenIkuraNum;
      this.id = result.id;
      this.ikuraNum = result.ikuraNum;
      this.playTime = result.id.playTime;
      this.scenarioCode = result.scenarioCode;
      this.schedule = schedule;
      this.jobResult = new JobResult(result);
      this.waveDetails = result.waveResults.map((wave) => new WaveResult(wave, result.id, result.resultWave, result.isBossDefeated));
      this.members = result.players.map((member) => {
        const counts: number[] = specialCounts.map((special) => special.filter((id) => id === member.specialWeapon.id).length);
        return new MemberResult(
          member,
          counts,
          result.bossKillCounts,
          result.gradeId,
          result.gradePoint,
          result.smellMeter,
          result.jobBonus,
          result.jobScore,
          result.kumaPoint,
          result.jobRate,
        );
      });
      this.scale = [result.scale.bronze, result.scale.silver, result.scale.gold];
    }
  }

  export class StageScheduleQuery {
    readonly schedules: Schedule[];
  }

  // export class CoopHistoryDetailQuery {
  //   readonly results: CoopHistoryDetail[];
  // }

  export class CoopHistoryNode {
    readonly schedule: Schedule;
    readonly results: CoopHistoryDetail[];
  }

  export class CoopHistoryQuery {
    readonly histories: CoopHistoryNode[];
  }
}
