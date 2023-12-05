import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CoopHistoryQuery } from 'src/dto/history.dto';

@Injectable()
export class HistoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: CoopHistoryQuery.Request): Promise<CoopHistoryQuery.Response[]> {
    await this.prisma.schedule.createMany(request.create);
    // @ts-ignore
    return request.nodes.map((node) => {
      return {
        results: node.historyDetails.nodes.map((result) => {
          return {
            goldenIkuraNum: result.goldenIkuraNum,
            gradeId: result.gradeId,
            gradePoint: result.gradePoint,
            id: result.id,
            stageId: result.coopStage.id,
            hash: result.hash,
            ikuraNum: result.ikuraNum,
            jobResult: {
              isClear: result.isClear,
            },
            weaponList: result.weaponList,
          };
        }),
        schedule: {
          endTime: node.endTime,
          id: node.scheduleId,
          mode: node.mode,
          rule: node.rule,
          stageId: node.stageId,
          startTime: node.startTime,
          weaponList: node.weaponList,
        },
      };
    });
  }
}
