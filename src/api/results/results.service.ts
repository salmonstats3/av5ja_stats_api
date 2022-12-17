import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { re } from 'mathjs';
import { PrismaService } from 'src/prisma.service';
import { CoopResultCreateResponse } from '../dto/response.dto';
import { BossResult } from '../dto/splatnet3/boss.dto';
import {
  CoopHistoryDetail,
  Mode,
} from '../dto/splatnet3/coop_history_detail.dto';
import { EnemyResult } from '../dto/splatnet3/enemy.dto';
import { Player } from '../dto/splatnet3/player.dto';
import { IntegerId } from '../dto/splatnet3/rawvalue.dto';
import { Result } from '../dto/splatnet3/result.dto';
import {
  CustomResultRequest,
  ResultRequest,
} from '../dto/splatnet3/results.dto';
import { WaveResult } from '../dto/splatnet3/wave.dto';
import { ResultsModule } from './results.module';

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

class CustomPlayer extends Player {
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
  specialId: number;
  weaponList: number[];
  smellMeter: number | null;
  specialUsage: number[];

  constructor(
    player: Player,
    result: CoopHistoryDetail,
    specialUsage: number[][]
  ) {
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
    this.gradeId = this.isMyself ? result.afterGrade.id : null;
    this.gradePoint = this.isMyself ? result.afterGradePoint : null;
    this.textColor = [
      player.player.nameplate.background.textColor.r,
      player.player.nameplate.background.textColor.g,
      player.player.nameplate.background.textColor.b,
      player.player.nameplate.background.textColor.a,
    ];
    this.badges = player.player.nameplate.badges.map(
      (badge) => badge?.id ?? -1
    );
    const bossKillCounts: number[] = this.enemies(result.enemyResults).map(
      (enemy) => enemy.defeatCount
    );
    this.specialId = player.specialWeapon.weaponId;
    this.specialUsage = specialUsage.map(
      (waves) => waves.filter((special) => special == this.specialId).length
    );

    this.bossKillCounts = this.isMyself
      ? bossKillCounts
      : [...Array(14)].map(() => -1);
    this.weaponList = player.weapons.map((weapon) => weapon.image.url);
    this.smellMeter = this.isMyself ? result.smellMeter : null;
  }

  private isMyResult(playerId: string): boolean {
    const regexp: RegExp = /u-[a-z\d]{20}/g;
    const match: string[] | null = playerId.match(regexp);

    if (match.length != 2) {
      throw new BadRequestException();
    }
    return match[0] == match[1];
  }

  private playerId(playerId: string): string {
    const regexp: RegExp = /u-([a-z\d]{20})$/;
    const match: string[] | null = regexp.exec(playerId);
    return match[1];
  }

  private enemies(results: EnemyResult[]): EnemyResult[] {
    return [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 20].map((enemyId) => {
      const enemy: EnemyResult = results.find(
        (result) => result.enemy.id == enemyId
      );
      return new EnemyResult(enemy, enemyId);
    });
  }
}

class CustomResult extends CoopHistoryDetail {
  ikuraNum: number;
  goldenIkuraNum: number;
  goldenIkuraAssistNum: number;
  bossCounts: number[];
  bossKillCounts: number[];
  nightLess: boolean;
  members: string[];
  players: CustomPlayer[];
  isClear: boolean;
  failureWave: number | null;
  isBossDefeated: boolean | null;
  bossId: number | null;
  waves: CustomWave[];
  stageId: number;
  weaponList: number[];
  mode: Mode;

  constructor(result: CoopHistoryDetail) {
    super();
    this.id = this.resultId(result.id);
    this.goldenIkuraNum = result.waveResults
      .map((wave) => wave.teamDeliverCount)
      .reduce((a, b) => a + b);
    const enemyResults: EnemyResult[] = this.enemies(result.enemyResults);
    this.waves = result.waveResults.map(
      (wave) =>
        new CustomWave(
          wave,
          result.resultWave,
          result.bossResult?.hasDefeatBoss ?? false
        )
    );

    const specialUsage: number[][] = this.waves.map(
      (wave) => wave.specialUsage
    );
    this.players = [result.myResult]
      .concat(result.memberResults)
      .map((player) => new CustomPlayer(player, result, specialUsage));

    this.goldenIkuraAssistNum = this.players
      .map((player) => player.goldenAssistCount)
      .reduce((a, b) => a + b);
    this.ikuraNum = this.players
      .map((player) => player.deliverCount)
      .reduce((a, b) => a + b);
    this.members = this.players.map((player) => player.pid);
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
    const regexp: RegExp =
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
    const match: string[] | null = resultId.match(regexp);
    return match[0];
  }

  private enemies(results: EnemyResult[]): EnemyResult[] {
    return [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 20].map((enemyId) => {
      const enemy: EnemyResult = results.find(
        (result) => result.enemy.id == enemyId
      );
      return new EnemyResult(enemy, enemyId);
    });
  }
}

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertManyV1(
    request: ResultRequest
  ): Promise<CoopResultCreateResponse[]> {
    const query = request.results.map((result) => {
      const data: CustomResult = new CustomResult(
        result.data.coopHistoryDetail
      );
      return this.prisma.result.upsert(this.query(data));
    });
    return (await this.prisma.$transaction([...query])).map(
      (result) => new CoopResultCreateResponse(result.resultId, result.salmonId)
    );
  }

  async upsertManyV2(
    request: CustomResultRequest
  ): Promise<CoopResultCreateResponse[]> {
    // const query = request.results.map((result) => {
    //   const data: CustomResult = new CustomResult(
    //     result.data.coopHistoryDetail
    //   );
    //   return this.prisma.result.upsert(this.query(data));
    // });
    // return (await this.prisma.$transaction([...query])).map(
    //   (result) => new CoopResultCreateResponse(result.resultId, result.salmonId)
    // );
    return;
  }

  query(result: CustomResult): Prisma.ResultUpsertArgs {
    return {
      update: {},
      where: {
        resultId: result.id,
      },
      create: {
        resultId: result.id,
        bossCounts: result.bossCounts,
        bossKillCounts: result.bossKillCounts,
        ikuraNum: result.ikuraNum,
        goldenIkuraNum: result.goldenIkuraNum,
        goldenIkuraAssistNum: result.goldenIkuraAssistNum,
        nightLess: result.nightLess,
        dangerRate: result.dangerRate,
        playTime: result.playedTime,
        members: result.members,
        isClear: result.isClear,
        failureWave: result.failureWave,
        isBossDefeated: result.isBossDefeated,
        bossId: result.bossId,
        waves: {
          createMany: {
            data: result.waves.map((wave) => {
              return {
                waveId: wave.waveNumber,
                waterLevel: wave.waterLevel,
                eventType: wave.eventType,
                goldenIkuraNum: wave.teamDeliverCount,
                goldenIkuraPopNum: wave.goldenPopCount,
                quotaNum: wave.deliverNorm,
                isClear: wave.isClear,
              };
            }),
          },
        },
        players: {
          createMany: {
            data: result.players.map((player: CustomPlayer) => {
              return {
                pid: player.pid,
                name: player.player.name,
                byname: player.player.byname,
                nameId: player.player.nameId,
                badges: player.player.nameplate.badges.map(
                  (badge) => badge?.id ?? -1
                ),
                nameplate: player.player.nameplate.background.id,
                textColor: [
                  player.player.nameplate.background.textColor.a,
                  player.player.nameplate.background.textColor.b,
                  player.player.nameplate.background.textColor.g,
                  player.player.nameplate.background.textColor.r,
                ],
                uniform: player.player.uniform.id,
                bossKillCountsTotal: player.defeatEnemyCount,
                bossKillCounts: player.bossKillCounts,
                deadCount: player.rescuedCount,
                helpCount: player.rescueCount,
                ikuraNum: player.deliverCount,
                goldenIkuraNum: player.goldenDeliverCount,
                goldenIkuraAssistNum: player.goldenAssistCount,
                species: player.player.species,
                specialId: player.specialId,
                jobRate: player.jobRate,
                jobBonus: player.jobBonus,
                jobScore: player.jobScore,
                kumaPoint: player.kumaPoint,
                gradeId: player.gradeId,
                gradePoint: player.gradePoint,
                smellMeter: player.smellMeter,
                weaponList: player.weaponList,
                specialCounts: player.specialUsage,
              };
            }),
          },
        },
        schedule: {
          connectOrCreate: {
            create: {
              stageId: result.stageId,
              weaponList: result.weaponList,
              mode: result.mode,
              rule: result.rule,
            },
            where: {
              stageId_weaponList_mode_rule: {
                stageId: result.stageId,
                weaponList: result.weaponList,
                mode: result.mode,
                rule: result.rule,
              },
            },
          },
        },
      },
    };
  }
}
