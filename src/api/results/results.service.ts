import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CoopHistoryDetail } from '../dto/splatnet3/coop_history_detail.dto';
import { Player } from '../dto/splatnet3/player.dto';
import { Result } from '../dto/splatnet3/result.dto';
import { ResultRequest } from '../dto/splatnet3/results.dto';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: Result): Promise<ResultRequest> {
    const result: CoopHistoryDetail = request.data.coopHistoryDetail;
    console.log(result.id);
    await this.prisma.result.upsert({
      where: {
        resultId: result.id,
      },
      update: {},
      create: {
        resultId: result.id,
        bossCounts: [],
        bossKillCounts: [],
        ikuraNum: 9999,
        goldenIkuraNum: 999,
        goldenIkuraAssistNum: 999,
        nightLess: false,
        dangerRate: result.dangerRate,
        startTime: null,
        playTime: result.playedTime,
        endTime: null,
        members: [],
        isClear: true,
        failureWave: null,
        isBossDefeated: null,
        bossId: 23,
        waves: {
          createMany: {
            data: result.waveResults.map((wave) => {
              return {
                waveId: wave.waveNumber,
                waterLevel: wave.waterLevel,
                eventType: wave.eventWave?.id ?? 0,
                goldenIkuraNum: wave.teamDeliverCount,
                goldenIkuraPopNum: wave.goldenPopCount,
                quotaNum: wave.deliverNorm,
                isClear: true,
              };
            }),
          },
        },
        players: {
          createMany: {},
        },
        schedule: {
          connectOrCreate: {
            create: {
              stageId: result.coopStage.id,
              weaponList: result.weapons.map((weapon) => weapon.image.url),
              mode: 'REGULAR',
              rule: 'REGULAR',
            },
            where: {
              stageId_weaponList_mode_rule: {
                stageId: result.coopStage.id,
                weaponList: result.weapons.map((weapon) => weapon.image.url),
                mode: 'REGULAR',
                rule: 'REGULAR',
              },
            },
          },
        },
      },
    });
    return;
  }
}
