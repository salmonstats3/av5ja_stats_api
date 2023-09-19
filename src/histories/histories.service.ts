import { Injectable } from '@nestjs/common';
import { Schedule } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { HistoryCreateDto } from 'src/dto/history.dto';

@Injectable()
export class HistoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: HistoryCreateDto): Promise<Schedule[]> {
    const results = await this.prisma.schedule.createMany(request.create);
    console.log(results);
    return;
  }
}
