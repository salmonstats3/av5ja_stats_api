import { HttpModule } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaModule, PrismaService } from 'nestjs-prisma'

import { ResultsService } from '@/results/results.service'

describe('ResultsService', () => {
  let service: ResultsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, HttpModule],
      providers: [ResultsService, PrismaService],
    }).compile()

    service = module.get<ResultsService>(ResultsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
