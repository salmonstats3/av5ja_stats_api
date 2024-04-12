import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { PrismaService } from 'nestjs-prisma'

import { CoopHistoryQuery } from '@/dto/av5ja/coop_history.dto'
import { CoopSchedule } from '@/dto/coop_schedule'
import { CoopHistoryDetailQuery as R2 } from '@/dto/request/result.v2.dto'
import { CoopMode } from '@/enum/coop_mode'

@Injectable()
export class HistoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: CoopHistoryQuery.HistoryRequest): Promise<CoopHistoryQuery.HistoryResponse> {
    const schedules: Partial<CoopSchedule>[] = request.histories.histories
      .map((history) => history.schedule)
      .filter((schedule) => schedule.mode === CoopMode.PRIVATE_CUSTOM)
    await Promise.allSettled(schedules.map((schedule) => this.prisma.schedule.upsert(schedule.upsert)))
    return request.histories
  }

  async update(request: CoopHistoryQuery.HistoryUpdateRequest): Promise<R2.V2.Paginated> {
    const results: R2.V2.CoopResult[] = request.histories.flatMap((history) =>
      history._results.map((result) => R2.V2.CoopResult.from(history.schedule, result)),
    )
    await Promise.allSettled(results.map((result) => this.prisma.result.upsert(result.upsert)))
    return plainToInstance(R2.V2.Paginated, { results: results })
  }
}
