import { HttpModule } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaModule, PrismaService } from 'nestjs-prisma'

import { RecordsService } from './records.service'

describe('RecordsService', () => {
  let service: RecordsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, HttpModule],
      providers: [RecordsService, PrismaService],
    }).compile()

    service = module.get<RecordsService>(RecordsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
