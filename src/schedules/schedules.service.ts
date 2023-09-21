import { Injectable } from '@nestjs/common';
import { Schedule } from '@prisma/client';
import dayjs from 'dayjs';
import lodash from 'lodash';
import { PrismaService } from 'nestjs-prisma';
import { CoopScheduleResponseDto, ScheduleCreateDto } from 'src/dto/schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: ScheduleCreateDto): Promise<CoopScheduleResponseDto[]> {
    await this.prisma.schedule.createMany(request.create);
    return request.schedules.map((schedule) => {
      return {
        endTime: dayjs(schedule.endTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        mode: schedule.mode,
        rule: schedule.rule,
        stageId: schedule.stageId,
        startTime: dayjs(schedule.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        weaponList: schedule.weaponList,
      };
    });
  }

  async find_all(): Promise<Partial<Schedule>[]> {
    return (await this.prisma.schedule.findMany()).map((schedule) => lodash.omit(schedule, ['createdAt', 'updatedAt']));
  }
}
