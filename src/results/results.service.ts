import { Injectable } from '@nestjs/common';
import { Mode, Result, Schedule } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import lodash from 'lodash';
import { PrismaService } from 'nestjs-prisma';
import { CoopHistoryDetailQuery } from 'src/dto/history.detail.request.dto';
import { CoopResultQuery } from 'src/dto/history.detail.response.dto';
import { scheduleHash } from 'src/utils/hash';
import { zip } from 'src/utils/zip';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async find(resultId: string): Promise<Partial<Result>> {
    return lodash.omit(
      await this.prisma.result.findUnique({
        include: this.include,
        where: {
          resultId: resultId,
        },
      }),
      ['createdAt', 'updatedAt', 'scheduleId'],
    );
  }

  async find_all(): Promise<Partial<Result>[]> {
    const results = await this.prisma.result.findMany({
      include: this.include,
    });
    return results.map((result) => lodash.omit(result, ['createdAt', 'updatedAt', 'scheduleId']));
  }

  async create(request: CoopHistoryDetailQuery.Paginated | CoopResultQuery.Paginated): Promise<CoopResultQuery.Paginated> {
    const results: CoopResultQuery.Request[] = await (async () => {
      if (request instanceof CoopHistoryDetailQuery.Paginated) {
        const schedules = await Promise.all(request.results.map((result: any) => this.connectOrCreate(result)));
        return zip(request, schedules);
      }
      if (request instanceof CoopResultQuery.Paginated) {
        return request.results as CoopResultQuery.Request[];
      }
      return [];
    })();
    await this.prisma.$transaction(results.map((result) => this.prisma.result.upsert(result.upsert)));
    return plainToInstance(CoopResultQuery.Paginated, { results: results });
  }

  /**
   * リザルトに対応するスケジュールを返す
   * @param request
   * @returns
   */
  private async connectOrCreate(request: CoopHistoryDetailQuery.Request): Promise<Schedule> {
    /**
     * プライベートバイトであれば検索して見つからなければ作成する
     */
    if (request.mode === Mode.PRIVATE_CUSTOM || request.mode === Mode.PRIVATE_SCENARIO) {
      try {
        return await this.prisma.schedule.findFirstOrThrow({
          where: {
            endTime: null,
            mode: request.mode,
            rule: request.rule,
            stageId: request.stageId,
            startTime: null,
            weaponList: {
              equals: request.weaponList,
            },
          },
        });
      } catch {
        /**
         * プライベートバイトであればハッシュがリザルトから計算できるので作成する
         */
        const scheduleId: string = scheduleHash(request.mode, request.rule, null, null, request.stageId, request.weaponList);
        return await this.prisma.schedule.create({
          data: {
            endTime: null,
            mode: request.mode,
            rule: request.rule,
            scheduleId: scheduleId,
            stageId: request.stageId,
            startTime: null,
            weaponList: request.weaponList,
          },
        });
      }
    } else {
      /**
       * レギュラーの場合はなければエラーを返す
       */
      return await this.prisma.schedule.findFirstOrThrow({
        where: {
          endTime: {
            gte: request.playTime,
          },
          mode: request.mode,
          rule: request.rule,
          stageId: request.stageId,
          startTime: {
            lte: request.playTime,
          },
          weaponList: {
            equals: request.weaponList,
          },
        },
      });
    }
  }

  private include = {
    players: {
      select: {
        badges: true,
        bossKillCounts: true,
        bossKillCountsTotal: true,
        byname: true,
        deadCount: true,
        goldenIkuraAssistNum: true,
        goldenIkuraNum: true,
        gradeId: true,
        gradePoint: true,
        helpCount: true,
        ikuraNum: true,
        jobBonus: true,
        jobRate: true,
        jobScore: true,
        kumaPoint: true,
        name: true,
        nameId: true,
        nameplate: true,
        nplnUserId: true,
        smellMeter: true,
        specialCounts: true,
        specialId: true,
        species: true,
        textColor: true,
        uniform: true,
        weaponList: true,
      },
    },
    schedule: {
      select: {
        bossId: true,
        endTime: true,
        mode: true,
        rule: true,
        scheduleId: true,
        stageId: true,
        startTime: true,
        weaponList: true,
      },
    },
    waves: {
      select: {
        eventType: true,
        goldenIkuraNum: true,
        goldenIkuraPopNum: true,
        isClear: true,
        quotaNum: true,
        waterLevel: true,
        waveId: true,
      },
    },
  };
}
