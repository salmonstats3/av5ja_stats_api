import { HttpModule } from '@nestjs/axios'
import { CacheModule } from '@nestjs/cache-manager'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaModule, PrismaService } from 'nestjs-prisma'

import { SchedulesController } from '@/schedules/schedules.controller'
import { SchedulesService } from '@/schedules/schedules.service'

describe('SchedulesController', () => {
  let controller: SchedulesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulesController],
      imports: [HttpModule, CacheModule.register(), PrismaModule],
      providers: [SchedulesService, PrismaService],
    }).compile()

    controller = module.get<SchedulesController>(SchedulesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
