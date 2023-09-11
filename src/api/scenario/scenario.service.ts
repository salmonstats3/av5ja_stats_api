import { Injectable } from '@nestjs/common';
import { Result } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

import { PaginatedDto, PaginatedRequestDto } from '../dto/pagination.dto';

@Injectable()
export class ScenarioService {
  constructor(private readonly prisma: PrismaService) {}

  async getScenario(request: PaginatedRequestDto): Promise<PaginatedDto<Partial<Result>>> {
    const count: number = (await this.prisma.result.count({
      where: {
        isClear: {
          equals: true,
        },
        scenarioCode: {
          not: null,
        },
      },
    })) as number;
    const results: Partial<Result>[] = await this.prisma.result.findMany({
      distinct: ['scenarioCode'],
      select: {
        bossId: true,
        dangerRate: true,
        goldenIkuraNum: true,
        isBossDefeated: true,
        scenarioCode: true,
        schedule: {
          select: {
            stageId: true,
            weaponList: true,
          },
        },
        waves: {
          select: {
            eventType: true,
            goldenIkuraNum: true,
            waterLevel: true,
          },
        },
      },
      skip: request.offset,
      take: request.limit,
      where: {
        isClear: true,
        scenarioCode: {
          not: null,
        },
      },
    });
    const response: PaginatedDto<Partial<Result>> = new PaginatedDto<Partial<Result>>(request.limit, request.offset, count, results);
    return response;
  }
}
