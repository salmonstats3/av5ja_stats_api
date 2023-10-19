import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'nestjs-prisma';
import { CoopHistoryQuery } from 'src/dto/history.dto';

@Injectable()
export class HistoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: CoopHistoryQuery.Request): Promise<CoopHistoryQuery.Response> {
    await this.prisma.schedule.createMany(request.create);
    return {
      results: request.schedules.flatMap((schedule) => schedule.historyDetails.nodes.map((node) => node.id.rawValue)),
      schedules: request.schedules.map((schedule) => {
        return plainToInstance(CoopHistoryQuery.Schedule, {
          endTime: schedule.endTime,
          mode: schedule.mode,
          rule: schedule.rule,
          stageId: schedule.stageId,
          startTime: schedule.startTime,
          weaponList: schedule.weaponList,
        });
      }),
    };
  }
}
