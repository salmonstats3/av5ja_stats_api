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
          schedule: {
            id: node.scheduleId,
            startTime: node.startTime,
            endTime: node.endTime,
            mode: node.mode,
            rule: node.rule,
            stageId: node.stageId,
            bossId: undefined,
            weaponList: node.weaponList
          },
          results: node.historyDetails.nodes.map((detail) => {
            return {
              id: detail.id,
              hash: detail.hash,
              stageId: detail.coopStage.id,
              weaponList: detail.weaponList,
              gradeId: detail.gradeId,
              gradePoint: detail.gradePoint,
              ikuraNum: detail.ikuraNum,
              goldenIkuraNum: detail.goldenIkuraNum,
              jobResult: {
                failureWave: null,
                isClear: detail.isClear,
                bossId: detail.bossResult.id,
                isBossDefeated: detail.bossResult.isBossDefeated
              },
            }
          })
        }
      })
    })
  }
}
