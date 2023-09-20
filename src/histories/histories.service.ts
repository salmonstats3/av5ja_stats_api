import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { HistoryCreateDto } from 'src/dto/history.dto';

@Injectable()
export class HistoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: HistoryCreateDto): Promise<void> {
    await this.prisma.schedule.createMany(request.create);
    return;
  }
}
