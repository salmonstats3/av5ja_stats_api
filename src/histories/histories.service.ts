import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'

import { CoopHistoryQuery } from '@/dto/av5ja/coop_history.dto'
import { CoopSchedule } from '@/dto/coop_schedule'
import { CoopMode } from '@/enum/coop_mode'

@Injectable()
export class HistoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: CoopHistoryQuery.Request): Promise<CoopHistoryQuery.Response> {
    const schedules: Partial<CoopSchedule>[] = request.histories.histories
      .map((history) => history.schedule)
      .filter((schedule) => schedule.mode === CoopMode.PRIVATE_CUSTOM)
    await Promise.allSettled(schedules.map((schedule) => this.prisma.schedule.upsert(schedule.upsert)))
    return request.histories
  }
}
