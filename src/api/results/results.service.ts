import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import snakecaseKeys from 'snakecase-keys';
import { PrismaService } from 'src/prisma.service';
import {
  CoopResultCreateResponse,
  CoopResultResponse,
} from '../dto/response.dto';
import {
  CustomCoopHistoryDetailRequest,
  CustomPlayerRequest,
} from '../dto/splatnet3/custom.dto';
import { CustomCoopResultRequest } from '../dto/splatnet3/result.dto';
import {
  CustomResultRequest,
  ResultRequest,
} from '../dto/splatnet3/results.dto';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertManyV1(
    request: ResultRequest
  ): Promise<CoopResultCreateResponse[]> {
    const query = request.results.map((result) => {
      const data: CustomCoopHistoryDetailRequest =
        new CustomCoopHistoryDetailRequest(result.data.coopHistoryDetail);
      return this.prisma.result.upsert(this.queryV1(data));
    });
    return (await this.prisma.$transaction([...query])).map(
      (result) => new CoopResultCreateResponse(result.uuid, result.salmonId)
    );
  }

  async upsertManyV2(
    request: CustomResultRequest
  ): Promise<CoopResultCreateResponse[]> {
    const results: CoopResultCreateResponse[] = await Promise.all(
      request.results.map(async (result) => {
        const res = await this.prisma.result.upsert(this.queryV2(result));
        return new CoopResultCreateResponse(res.uuid, res.salmonId);
      })
    );
    return results;
  }

  async upsertManyV2All(
    request: CustomResultRequest
  ): Promise<CoopResultCreateResponse[]> {
    const query = request.results.map((result) => {
      return this.prisma.result.upsert(this.queryV2(result));
    });
    return (await this.prisma.$transaction([...query])).map(
      (result) => new CoopResultCreateResponse(result.uuid, result.salmonId)
    );
  }

  async getResults(salmonId: number): Promise<CoopResultResponse> {
    try {
      const result: CoopResultResponse = plainToClass(
        CoopResultResponse,
        await this.prisma.result.findUniqueOrThrow({
          where: {
            salmonId: salmonId,
          },
          include: {
            players: true,
            waves: true,
            schedule: true,
          },
        }),
        {
          exposeUnsetFields: false,
          excludeExtraneousValues: true,
          exposeDefaultValues: true,
          enableCircularCheck: true,
        }
      );
      return result;
    } catch {
      throw new NotFoundException();
    }
  }

  queryV1(result: CustomCoopHistoryDetailRequest): Prisma.ResultUpsertArgs {
    return {
      update: {},
      where: {
        id: result.id,
      },
      create: {
        id: result.id,
        uuid: result.uuid,
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
            data: result.players.map((player: CustomPlayerRequest) => {
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

  queryV2(result: CustomCoopResultRequest): Prisma.ResultUpsertArgs {
    const members: string[] = [result.myResult]
      .concat(result.otherResults)
      .map((player) => player.id);
    const nightLess: boolean = result.waveDetails.every(
      (wave) => wave.eventType == 0
    );
    return {
      update: {
        players: {
          update: {
            where: {
              resultId_pid: {
                resultId: result.id,
                pid: result.myResult.id,
              },
            },
            data: {
              bossKillCounts: result.myResult.bossKillCounts,
              jobBonus: result.jobBonus,
              jobScore: result.jobScore,
              kumaPoint: result.kumaPoint,
              jobRate: result.jobRate,
              smellMeter: result.smellMeter,
              gradeId: result.gradeId,
              gradePoint: result.gradePoint,
            },
          },
        },
      },
      where: {
        id: result.id,
      },
      create: {
        id: result.id,
        uuid: result.uuid,
        bossCounts: result.bossCounts,
        bossKillCounts: result.bossKillCounts,
        ikuraNum: result.ikuraNum,
        goldenIkuraNum: result.goldenIkuraNum,
        goldenIkuraAssistNum: result.goldenIkuraAssistNum,
        nightLess: nightLess,
        dangerRate: result.dangerRate,
        playTime: result.playTime,
        members: members,
        isClear: result.jobResult.isClear,
        failureWave: result.jobResult.failureWave,
        isBossDefeated: result.jobResult.isBossDefeated,
        bossId: result.jobResult.bossId,
        waves: {
          createMany: {
            data: result.waveDetails.map((wave) => {
              return {
                waveId: wave.id,
                waterLevel: wave.waterLevel,
                eventType: wave.eventType,
                goldenIkuraNum: wave.goldenIkuraNum,
                goldenIkuraPopNum: wave.goldenIkuraPopNum,
                quotaNum: wave.quotaNum,
                isClear: wave.isClear,
              };
            }),
          },
        },
        players: {
          createMany: {
            data: [result.myResult]
              .concat(result.otherResults)
              .map((player) => {
                return {
                  pid: player.id,
                  name: player.name,
                  byname: player.byname,
                  nameId: player.nameId,
                  badges: player.nameplate.badges.map((badge) => badge ?? -1),
                  nameplate: player.nameplate.background.id,
                  textColor: [
                    player.nameplate.background.textColor.r,
                    player.nameplate.background.textColor.g,
                    player.nameplate.background.textColor.b,
                    player.nameplate.background.textColor.a,
                  ],
                  uniform: player.uniform,
                  bossKillCountsTotal: player.bossKillCountsTotal,
                  bossKillCounts: player.isMyself
                    ? player.bossKillCounts
                    : player.bossKillCounts.map((count) => -1),
                  deadCount: player.deadCount,
                  helpCount: player.helpCount,
                  ikuraNum: player.ikuraNum,
                  goldenIkuraNum: player.goldenIkuraNum,
                  goldenIkuraAssistNum: player.goldenIkuraAssistNum,
                  species: player.species,
                  specialId: player.specialId,
                  jobRate: player.isMyself ? result.jobRate : null,
                  jobBonus: player.isMyself ? result.jobBonus : null,
                  jobScore: player.isMyself ? result.jobScore : null,
                  kumaPoint: player.isMyself ? result.kumaPoint : null,
                  gradeId: player.isMyself ? result.gradeId : null,
                  gradePoint: player.isMyself ? result.gradePoint : null,
                  smellMeter: player.isMyself ? result.smellMeter : null,
                  weaponList: player.weaponList,
                  specialCounts: player.specialCounts,
                };
              }),
          },
        },
        schedule: {
          connectOrCreate: {
            create: {
              stageId: result.schedule.stageId,
              weaponList: result.schedule.weaponList,
              mode: result.schedule.mode,
              rule: result.schedule.rule,
            },
            where: {
              stageId_weaponList_mode_rule: {
                stageId: result.schedule.stageId,
                weaponList: result.schedule.weaponList,
                mode: result.schedule.mode,
                rule: result.schedule.rule,
              },
            },
          },
        },
      },
    };
  }
}
