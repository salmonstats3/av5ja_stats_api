import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Mode, Result } from '@prisma/client';
import dayjs from 'dayjs';
import lodash from 'lodash';
import { PrismaService } from 'nestjs-prisma';
import { ResultCreateManyRequest } from 'src/dto/paginated.dto';
import { ResultCreateDto, ResultCreateRequest } from 'src/dto/result.dto';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) { }

  async find(id: string): Promise<Partial<Result>> {
    return lodash.omit(
      await this.prisma.result.findUnique({
        include: this.include,
        where: {
          resultId: id,
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

  async createV1(request: ResultCreateManyRequest): Promise<Partial<Result>[]> {
    // Promise.allを利用すると競合する可能性がワンチャンあったりする......
    return Promise.all(request.results.map((result) => this.prisma.result.upsert(result.upsert)));
  }

  async createV2(request: ResultCreateRequest): Promise<Partial<Result>[]> {
    // Promise.allを利用すると競合する可能性がワンチャンあったりする......
    return Promise.all(request.results.map((result) => this.upsert(result)));
  }

  private async upsert(request: ResultCreateDto): Promise<Partial<Result>> {
    /**
     * プライベートでない場合は、スケジュールを参照して結果を作成する
     */
    if (request.result.mode !== Mode.PRIVATE_CUSTOM && request.result.mode !== Mode.PRIVATE_SCENARIO) {
      try {
        // 該当するスケジュールを取得する
        const { startTime, endTime } = await this.prisma.schedule.findFirstOrThrow({
          where: {
            endTime: {
              gte: request.result.id.playTime,
            },
            mode: request.result.mode,
            rule: request.result.rule,
            stageId: request.result.coopStage.id,
            startTime: {
              lte: request.result.id.playTime,
            },
            weaponList: {
              equals: request.result.weaponList,
            },
          },
        });
        return await this.prisma.result.upsert(request.upsert(startTime, endTime));
      } catch (error) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
    } else {
      /**
       * プライベートの場合はUnix時間0を指定して書き込む
       */
      return await this.prisma.result.upsert(request.upsert(dayjs(0).toDate(), dayjs(0).toDate()));
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
