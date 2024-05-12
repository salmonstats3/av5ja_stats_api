import { HttpModule } from "@nestjs/axios"
import { Test, TestingModule } from "@nestjs/testing"
import { PrismaModule, PrismaService } from "nestjs-prisma"

import { SchedulesService } from "@/schedules/schedules.service"

describe("SchedulesService", () => {
  let service: SchedulesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, PrismaModule],
      providers: [SchedulesService, PrismaService]
    }).compile()

    service = module.get<SchedulesService>(SchedulesService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })
})
