import { Injectable, NotFoundException } from '@nestjs/common';
import { Mode, Result } from '@prisma/client';
import dayjs from 'dayjs';
import { PrismaService } from 'nestjs-prisma';
import { ResultCreateDto } from 'src/dto/result.dto';
import { deep_omit } from 'src/utils/omit';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: ResultCreateDto): Promise<Partial<Result>> {
    /**
     * プライベートでない場合は、スケジュールを参照して結果を作成する
     */
    if (request.result.mode !== Mode.PRIVATE_CUSTOM && request.result.mode !== Mode.PRIVATE_SCENARIO) {
      try {
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
        return deep_omit(await this.prisma.result.upsert(request.upsert(startTime, endTime)), ['createdAt', 'updatedAt']);
      } catch {
        throw new NotFoundException();
      }
    } else {
      /**
       * プライベートの場合はUnix時間0を指定して書き込む
       */
      return await this.prisma.result.upsert(request.upsert(dayjs(0).toDate(), dayjs(0).toDate()));
    }
  }
}
