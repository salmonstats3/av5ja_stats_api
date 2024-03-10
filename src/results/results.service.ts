import { Body, Injectable, UseFilters } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { PrismaService } from 'nestjs-prisma'

import { CoopHistoryDetailQuery as R3 } from '@/dto/av5ja/coop_history_detail.dto'
import { CoopSchedule } from '@/dto/coop_schedule'
import { CoopHistoryDetailQuery as R2 } from '@/dto/request/result.v2.dto'
import { CoopMode } from '@/enum/coop_mode'
import { ResultsFilter } from '@/results/results.filter'

@Injectable()
@UseFilters(ResultsFilter)
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async create_v2(@Body() request: R2.V2.Paginated): Promise<R2.V2.Paginated> {
    const results: R2.V2.CoopResult[] = request.results.filter((result) => result.isValid)
    await Promise.allSettled(results.map((result) => this.prisma.result.upsert(result.upsert)))
    return request
  }

  async create_v3(@Body() request: R3.V3.DetailRequest): Promise<R2.V2.Paginated> {
    const schedule: CoopSchedule = await this.schedule(request)
    const result = R2.V2.CoopResult.from(schedule, request)
    // await this.prisma.result.upsert(result.upsert)
    return {
      results: [result],
    }
  }

  private async schedule(request: R3.V3.DetailRequest): Promise<CoopSchedule> {
    return plainToInstance(
      CoopSchedule,
      this.prisma.schedule.findFirst({
        where: {
          endTime: {
            gte: request.playTime,
          },
          mode: {
            in: [CoopMode.REGULAR, CoopMode.LIMITED],
          },
          startTime: {
            lte: request.playTime,
          },
        },
      }),
      { excludeExtraneousValues: true },
    )
  }
}
