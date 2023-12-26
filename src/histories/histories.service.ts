import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'nestjs-prisma';
import { CoopHistoryQuery } from 'src/dto/history.dto';
import { Response } from 'src/dto/response.dto';

@Injectable()
export class HistoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: CoopHistoryQuery.Request): Promise<Response.CoopHistoryQuery> {
    await this.prisma.schedule.createMany(request.create);
    return plainToInstance(Response.CoopHistoryQuery, {
      histories: request.nodes.map((node) => {
        return {
          results: node.historyDetails.nodes.map((detail) => {
            return {
              goldenIkuraNum: detail.goldenIkuraNum,
              gradeId: detail.gradeId,
              gradePoint: detail.gradePoint,
              hash: detail.hash,
              id: detail.id,
              ikuraNum: detail.ikuraNum,
              jobResult: {
                bossId: detail.bossResult.id,
                failureWave: null,
                isBossDefeated: detail.bossResult.isBossDefeated,
                isClear: detail.isClear,
              },
              stageId: detail.coopStage.id,
              weaponList: detail.weaponList,
            };
          }),
          schedule: {
            bossId: undefined,
            endTime: node.endTime,
            id: node.scheduleId,
            mode: node.mode,
            rule: node.rule,
            stageId: node.stageId,
            startTime: node.startTime,
            weaponList: node.weaponList,
            rareWeapons: []
          },
        };
      }),
    });
  }
}
