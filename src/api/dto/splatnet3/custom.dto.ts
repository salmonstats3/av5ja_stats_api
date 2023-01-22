import { BadRequestException } from "@nestjs/common";

import { CoopHistoryDetailRequest, Mode } from "./coop_history_detail.dto";
import { EnemyResult } from "./enemy.dto";
import { PlayerRequest } from "./player.dto";
import { WaveResult } from "./wave.dto";

class CustomWave extends WaveResult {
  isClear: boolean;
  eventType: number;
  specialUsage: number[];

  constructor(wave: WaveResult, resultWave: number, isBossDefeated: boolean) {
    super();
    this.eventType = wave.eventWave?.id ?? 0;
    this.goldenPopCount = wave.goldenPopCount;
    this.waterLevel = wave.waterLevel;
    this.teamDeliverCount = wave.teamDeliverCount;
    this.waveNumber = wave.waveNumber;
    this.deliverNorm = wave.deliverNorm;
    this.isClear =
      resultWave == 0
        ? true
        : wave.waveNumber == 4
        ? isBossDefeated
        : wave.waveNumber != resultWave;
    this.specialUsage = wave.specialWeapons.map((special) => special.id);
  }
}

export class CustomPlayerRequest extends PlayerRequest {
  isMyself: boolean;
  pid: string;
  bossKillCounts: number[];
  jobBonus: number | null;
  jobScore: number | null;
  jobRate: number | null;
  kumaPoint: number | null;
  gradeId: number | null;
  gradePoint: number | null;
  textColor: number[];
  badges: number[];
  specialId: number | null;
  weaponList: number[];
  smellMeter: number | null;
  specialUsage: number[];

  constructor(player: PlayerRequest, result: CoopHistoryDetailRequest, specialUsage: number[][]) {
    super();
    this.player = player.player;
    this.defeatEnemyCount = player.defeatEnemyCount;
    this.rescueCount = player.rescueCount;
    this.rescuedCount = player.rescuedCount;
    this.deliverCount = player.deliverCount;
    this.goldenDeliverCount = player.goldenDeliverCount;
    this.goldenAssistCount = player.goldenAssistCount;
    this.isMyself = this.isMyResult(player.player.id);
    this.pid = this.playerId(player.player.id);
    this.jobBonus = this.isMyself ? result.jobBonus : null;
    this.jobScore = this.isMyself ? result.jobScore : null;
    this.jobRate = this.isMyself ? result.jobRate : null;
    this.kumaPoint = this.isMyself ? result.jobPoint : null;
    this.gradeId = this.isMyself ? result.afterGrade?.id : null;
    this.gradePoint = this.isMyself ? result.afterGradePoint : null;
    this.textColor = [
      player.player.nameplate.background.textColor.r,
      player.player.nameplate.background.textColor.g,
      player.player.nameplate.background.textColor.b,
      player.player.nameplate.background.textColor.a,
    ];
    this.badges = player.player.nameplate.badges.map((badge) => badge?.id ?? -1);
    const bossKillCounts: number[] = this.enemies(result.enemyResults).map(
      (enemy) => enemy.defeatCount,
    );
    this.specialId = player.specialWeapon.weaponId;
    this.specialUsage = specialUsage.map(
      (waves) => waves.filter((special) => special == this.specialId).length,
    );

    this.bossKillCounts = this.isMyself ? bossKillCounts : [...Array(14)].map(() => -1);
    this.weaponList = player.weapons.map((weapon) => weapon.image.url);
    this.smellMeter = this.isMyself ? result.smellMeter : null;
  }

  private isMyResult(playerId: string): boolean {
    const regexp = /u-[a-z\d]{20}/g;
    const match: string[] | null = playerId.match(regexp);

    if (match.length != 2) {
      throw new BadRequestException();
    }
    return match[0] == match[1];
  }

  private playerId(playerId: string): string {
    const regexp = /u-([a-z\d]{20})$/;
    const match: string[] | null = regexp.exec(playerId);
    return match[1];
  }

  private enemies(results: EnemyResult[]): EnemyResult[] {
    return [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 20].map((enemyId) => {
      const enemy: EnemyResult = results.find((result) => result.enemy.id == enemyId);
      return new EnemyResult(enemy, enemyId);
    });
  }
}

export class CustomCoopHistoryDetailRequest extends CoopHistoryDetailRequest {
  uuid: string;
  ikuraNum: number;
  goldenIkuraNum: number;
  goldenIkuraAssistNum: number;
  bossCounts: number[];
  bossKillCounts: number[];
  nightLess: boolean;
  members: string[];
  players: CustomPlayerRequest[];
  isClear: boolean;
  failureWave: number | null;
  isBossDefeated: boolean | null;
  bossId: number | null;
  waves: CustomWave[];
  stageId: number;
  weaponList: number[];
  mode: Mode;

  constructor(result: CoopHistoryDetailRequest) {
    super();
    this.id = result.id;
    this.uuid = this.resultId(result.id);
    this.goldenIkuraNum = result.waveResults
      .map((wave) => wave.teamDeliverCount)
      .reduce((a, b) => a + b);
    const enemyResults: EnemyResult[] = this.enemies(result.enemyResults);
    this.waves = result.waveResults.map(
      (wave) => new CustomWave(wave, result.resultWave, result.bossResult?.hasDefeatBoss ?? false),
    );

    const specialUsage: number[][] = this.waves.map((wave) => wave.specialUsage);
    this.players = [result.myResult]
      .concat(result.memberResults)
      .map((player) => new CustomPlayerRequest(player, result, specialUsage));

    this.goldenIkuraAssistNum = this.players
      .map((player) => player.goldenAssistCount)
      .reduce((a, b) => a + b);
    this.ikuraNum = this.players.map((player) => player.deliverCount).reduce((a, b) => a + b);
    this.members = this.players.map((player) => player.pid).sort();
    this.playedTime = result.playedTime;
    this.dangerRate = result.dangerRate;
    this.bossCounts = enemyResults.map((enemy) => enemy.popCount);
    this.bossKillCounts = enemyResults.map((enemy) => enemy.teamDefeatCount);
    this.nightLess = result.waveResults.every((wave) => wave.eventWave == null);
    this.isClear = result.resultWave == 0;
    this.failureWave = result.resultWave == 0 ? null : result.resultWave;
    this.isBossDefeated = result.bossResult?.hasDefeatBoss;
    this.bossId = result.bossResult?.boss.id;
    this.stageId = result.coopStage.id;
    this.weaponList = result.weapons.map((weapon) => weapon.image.url);
    this.mode =
      result.scenarioCode != null
        ? Mode.PRIVATE_SCENARIO
        : result.afterGrade == null
        ? Mode.PRIVATE_CUSTOM
        : Mode.REGULAR;
    this.rule = result.rule;
  }

  private resultId(resultId: string): string {
    const regexp = /\d{8}T\d{6}_[a-f0-9\-]{36}/;
    const matches: string[] | null = resultId.match(regexp);
    if (matches.length === 0 || matches === null) {
      throw new BadRequestException();
    }
    return matches[0];
  }

  private enemies(results: EnemyResult[]): EnemyResult[] {
    return [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 20].map((enemyId) => {
      const enemy: EnemyResult = results.find((result) => result.enemy.id == enemyId);
      return new EnemyResult(enemy, enemyId);
    });
  }
}
