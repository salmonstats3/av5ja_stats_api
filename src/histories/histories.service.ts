import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { PrismaService } from 'nestjs-prisma';
import { CoopHistoryResponseDto, HistoryCreateDto } from 'src/dto/history.dto';

@Injectable()
export class HistoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: HistoryCreateDto): Promise<CoopHistoryResponseDto> {
    await this.prisma.schedule.createMany(request.create);
    return {
      results: request.histories.flatMap((history) => history.historyDetails.nodes.map((node) => node.id.raw_value)),
      schedules: request.histories.map((history) => {
        return {
          endTime: dayjs(history.endTime).format('YYYY-MM-DDTHH:mm:ssZ'),
          mode: history.mode,
          rule: history.rule,
          stageId: history.stageId,
          startTime: dayjs(history.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
          weaponList: history.weaponList,
        };
      }),
    };
  }
}
