import { Injectable } from '@nestjs/common';
import { Schedule } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ScheduleCreateDto } from 'src/dto/schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: ScheduleCreateDto): Promise<Schedule[]> {
    const results = await this.prisma.schedule.createMany(request.create);
    console.log(results);
    return;
  }
}
