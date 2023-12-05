import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CoopHistoryQuery } from 'src/dto/history.dto';

@Injectable()
export class HistoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: CoopHistoryQuery.Request.Request): Promise<CoopHistoryQuery.Response.Response[]> {
    await this.prisma.schedule.createMany(request.create);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return request.nodes.map((node) => {
      return {
        results: node.historyDetails.nodes.map((result) => {
          return {
            goldenIkuraNum: result.goldenIkuraNum,
            gradeId: result.gradeId,
            gradePoint: result.gradePoint,
            hash: result.hash,
            id: result.id,
            ikuraNum: result.ikuraNum,
            jobResult: {
              isClear: result.isClear,
            },
            stageId: result.coopStage.id,
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
