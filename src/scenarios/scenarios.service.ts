import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ScenariosService {
  constructor(private readonly prisma: PrismaService) {}

  async find_all(): Promise<any> {
    return this.prisma.result.groupBy({
      _max: {
        goldenIkuraNum: true,
        ikuraNum: true,
      },
      by: ['scenarioCode'],
    });
  }
}
