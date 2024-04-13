import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'

import { CoopRecordQuery } from '@/dto/av5ja/coop_record.dto'

@Injectable()
export class RecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: CoopRecordQuery.RecordRequest): Promise<CoopRecordQuery.RecordResponse> {
    return new CoopRecordQuery.RecordResponse(request)
  }
}
