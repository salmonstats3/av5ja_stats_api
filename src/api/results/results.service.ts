import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { plainToClass } from "class-transformer";
import { PrismaService } from "src/prisma.service";

import { PaginatedDto } from "../dto/pagination.dto";
import { CoopResultFindManyArgsPaginatedRequest, SortKey } from "../dto/request.dto";
import { CoopResultCreateResponse, CoopResultResponse } from "../dto/response.dto";
import { Mode, Rule } from "../dto/splatnet3/coop_history_detail.dto";
import { CustomCoopHistoryDetailRequest, CustomPlayerRequest } from "../dto/splatnet3/custom.dto";
import { CustomCoopResultRequest } from "../dto/splatnet3/result.dto";
import { CustomResultRequest, ResultRequest } from "../dto/splatnet3/results.dto";

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  // イカリング3リザルト書き込み
  async upsertManyV1(request: ResultRequest): Promise<CoopResultCreateResponse[]> {
    const query = request.results.map((result) => {
      const data: CustomCoopHistoryDetailRequest = new CustomCoopHistoryDetailRequest(
        result.data.coopHistoryDetail,
      );
      return this.prisma.result.upsert(this.queryV1(data));
    });
    return (await this.prisma.$transaction([...query])).map(
      (result) => new CoopResultCreateResponse(result.uuid, result.salmonId),
    );
  }

  // Salmonia3+リザルト書き込み
  async upsertManyV2(request: CustomResultRequest): Promise<CoopResultCreateResponse[]> {
    const query = request.results.map((result) => {
      return this.prisma.result.upsert(this.queryV2(result));
    });
    return (await this.prisma.$transaction([...query])).map(
      (result) => new CoopResultCreateResponse(result.uuid, result.salmonId),
    );
  }

  // リザルト検索
  async findMany(
    request: CoopResultFindManyArgsPaginatedRequest,
  ): Promise<PaginatedDto<CoopResultResponse>> {
    const where: Prisma.ResultWhereInput = {
      goldenIkuraNum: {
        gte: request.goldenIkuraNum,
      },
      ikuraNum: {
        gte: request.ikuraNum,
      },
      isBossDefeated: {
        equals: request.isBossDefeated,
      },
      isClear: {
        equals: request.isClear,
      },
      nightLess: {
        equals: request.nightLess,
      },
      schedule: {
        mode: {
          equals: request.mode ?? Mode.REGULAR,
        },
        rule: {
          equals: request.rule ?? Rule.REGULAR,
        },
        ...(request.stageId === undefined
          ? {}
          : {
              equals: request.stageId,
            }),
        ...(request.weaponList === undefined
          ? {}
          : {
              equals: request.weaponList,
            }),
      },
      ...(request.member === undefined
        ? {}
        : {
            members: {
              has: request.member,
            },
          }),
    };
    const results: CoopResultResponse[] = (
      await this.prisma.result.findMany({
        include: {
          players: true,
          schedule: true,
          waves: true,
        },
        orderBy: {
          goldenIkuraNum: request.sort === SortKey.GoldenIkuraNum ? request.order : undefined,
          ikuraNum: request.sort === SortKey.IkuraNum ? request.order : undefined,
          playTime: request.sort === SortKey.PlayTime ? request.order : undefined,
          salmonId: request.sort === SortKey.SalmonId ? request.order : undefined,
        },
        skip: request.offset,
        take: request.limit,
        where: where,
      })
    ).map((result) =>
      plainToClass(CoopResultResponse, result, {
        enableCircularCheck: true,
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
        exposeUnsetFields: false,
      }),
    );
    const response = new PaginatedDto<CoopResultResponse>();
    response.limit = request.limit;
    response.offset = request.offset;
    response.total = await this.prisma.result.count({ where: where });
    response.results = results;
    return response;
  }

  async find(salmonId: number): Promise<CoopResultResponse> {
    try {
      const result: CoopResultResponse = plainToClass(
        CoopResultResponse,
        await this.prisma.result.findUniqueOrThrow({
          include: {
            players: true,
            schedule: true,
            waves: true,
          },
          where: {
            salmonId: salmonId,
          },
        }),
        {
          enableCircularCheck: true,
          excludeExtraneousValues: true,
          exposeDefaultValues: true,
          exposeUnsetFields: false,
        },
      );
      return result;
    } catch {
      throw new NotFoundException();
    }
  }

  // 書き込みのためのクエリ
  private queryV1(result: CustomCoopHistoryDetailRequest): Prisma.ResultUpsertArgs {
    return {
      create: {
        bossCounts: result.bossCounts,
        bossId: result.bossId,
        bossKillCounts: result.bossKillCounts,
        bronze: result.scale.bronze,
        dangerRate: result.dangerRate,
        failureWave: result.failureWave,
        gold: result.scale.gold,
        goldenIkuraAssistNum: result.goldenIkuraAssistNum,
        goldenIkuraNum: result.goldenIkuraNum,
        id: result.id,
        ikuraNum: result.ikuraNum,
        isBossDefeated: result.isBossDefeated,
        isClear: result.isClear,
        members: result.members,
        nightLess: result.nightLess,
        playTime: result.playedTime,
        players: {
          createMany: {
            data: result.players.map((player: CustomPlayerRequest) => {
              return {
                badges: player.player.nameplate.badges.map((badge) => badge?.id ?? -1),
                bossKillCounts: player.bossKillCounts,
                bossKillCountsTotal: player.defeatEnemyCount,
                byname: player.player.byname,
                deadCount: player.rescuedCount,
                goldenIkuraAssistNum: player.goldenAssistCount,
                goldenIkuraNum: player.goldenDeliverCount,
                gradeId: player.gradeId,
                gradePoint: player.gradePoint,
                helpCount: player.rescueCount,
                ikuraNum: player.deliverCount,
                jobBonus: player.jobBonus,
                jobRate: player.jobRate,
                jobScore: player.jobScore,
                kumaPoint: player.kumaPoint,
                name: player.player.name,
                nameId: player.player.nameId,
                nameplate: player.player.nameplate.background.id,
                pid: player.pid,
                smellMeter: player.smellMeter,
                specialCounts: player.specialUsage,
                specialId: player.specialId,
                species: player.player.species,
                textColor: [
                  player.player.nameplate.background.textColor.a,
                  player.player.nameplate.background.textColor.b,
                  player.player.nameplate.background.textColor.g,
                  player.player.nameplate.background.textColor.r,
                ],
                uniform: player.player.uniform.id,
                weaponList: player.weaponList,
              };
            }),
          },
        },
        schedule: {
          connectOrCreate: {
            create: {
              mode: result.mode,
              rule: result.rule,
              stageId: result.stageId,
              weaponList: result.weaponList,
            },
            where: {
              stageId_weaponList_mode_rule: {
                mode: result.mode,
                rule: result.rule,
                stageId: result.stageId,
                weaponList: result.weaponList,
              },
            },
          },
        },
        silver: result.scale.silver,
        uuid: result.uuid,
        waves: {
          createMany: {
            data: result.waves.map((wave) => {
              return {
                eventType: wave.eventType,
                goldenIkuraNum: wave.teamDeliverCount,
                goldenIkuraPopNum: wave.goldenPopCount,
                isClear: wave.isClear,
                quotaNum: wave.deliverNorm,
                waterLevel: wave.waterLevel,
                waveId: wave.waveNumber,
              };
            }),
          },
        },
      },
      update: {},
      where: {
        id: result.id,
      },
    };
  }

  // 書き込みのためのクエリ
  private queryV2(result: CustomCoopResultRequest): Prisma.ResultUpsertArgs {
    const members: string[] = [result.myResult]
      .concat(result.otherResults)
      .map((player) => player.pid)
      .sort();
    const nightLess: boolean = result.waveDetails.every((wave) => wave.eventType == 0);
    return {
      create: {
        bossCounts: result.bossCounts,
        bossId: result.jobResult.bossId,
        bossKillCounts: result.bossKillCounts,
        bronze: result.scale[0],
        dangerRate: result.dangerRate,
        failureWave: result.jobResult.failureWave,
        gold: result.scale[2],
        goldenIkuraAssistNum: result.goldenIkuraAssistNum,
        goldenIkuraNum: result.goldenIkuraNum,
        id: result.id,
        ikuraNum: result.ikuraNum,
        isBossDefeated: result.jobResult.isBossDefeated,
        isClear: result.jobResult.isClear,
        members: members,
        nightLess: nightLess,
        playTime: result.playTime,
        players: {
          createMany: {
            data: [result.myResult].concat(result.otherResults).map((player) => {
              return {
                badges: player.nameplate.badges.map((badge) => badge ?? -1),
                bossKillCounts: player.isMyself
                  ? player.bossKillCounts
                  : player.bossKillCounts.map(() => -1),
                bossKillCountsTotal: player.bossKillCountsTotal,
                byname: player.byname,
                deadCount: player.deadCount,
                goldenIkuraAssistNum: player.goldenIkuraAssistNum,
                goldenIkuraNum: player.goldenIkuraNum,
                gradeId: player.isMyself ? result.gradeId : null,
                gradePoint: player.isMyself ? result.gradePoint : null,
                helpCount: player.helpCount,
                ikuraNum: player.ikuraNum,
                jobBonus: player.isMyself ? result.jobBonus : null,
                jobRate: player.isMyself ? result.jobRate : null,
                jobScore: player.isMyself ? result.jobScore : null,
                kumaPoint: player.isMyself ? result.kumaPoint : null,
                name: player.name,
                nameId: player.nameId,
                nameplate: player.nameplate.background.id,
                pid: player.pid,
                smellMeter: player.isMyself ? result.smellMeter : null,
                specialCounts: player.specialCounts,
                specialId: player.specialId,
                species: player.species,
                textColor: [
                  player.nameplate.background.textColor.r,
                  player.nameplate.background.textColor.g,
                  player.nameplate.background.textColor.b,
                  player.nameplate.background.textColor.a,
                ],
                uniform: player.uniform,
                weaponList: player.weaponList,
              };
            }),
          },
        },
        schedule: {
          connectOrCreate: {
            create: {
              mode: result.schedule.mode,
              rule: result.schedule.rule,
              stageId: result.schedule.stageId,
              weaponList: result.schedule.weaponList,
            },
            where: {
              stageId_weaponList_mode_rule: {
                mode: result.schedule.mode,
                rule: result.schedule.rule,
                stageId: result.schedule.stageId,
                weaponList: result.schedule.weaponList,
              },
            },
          },
        },
        silver: result.scale[1],
        uuid: result.uuid,
        waves: {
          createMany: {
            data: result.waveDetails.map((wave) => {
              return {
                eventType: wave.eventType,
                goldenIkuraNum: wave.goldenIkuraNum,
                goldenIkuraPopNum: wave.goldenIkuraPopNum,
                isClear: wave.isClear,
                quotaNum: wave.quotaNum,
                waterLevel: wave.waterLevel,
                waveId: wave.id,
              };
            }),
          },
        },
      },
      update: {
        players: {
          update: {
            data: {
              bossKillCounts: result.myResult.bossKillCounts,
              gradeId: result.gradeId,
              gradePoint: result.gradePoint,
              jobBonus: result.jobBonus,
              jobRate: result.jobRate,
              jobScore: result.jobScore,
              kumaPoint: result.kumaPoint,
              smellMeter: result.smellMeter,
            },
            where: {
              resultId_pid: {
                pid: result.myResult.pid,
                resultId: result.id,
              },
            },
          },
        },
      },
      where: {
        id: result.id,
      },
    };
  }
}
