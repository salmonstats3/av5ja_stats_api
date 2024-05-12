import { HttpModule } from "@nestjs/axios"
import { Test, TestingModule } from "@nestjs/testing"
import { PrismaModule, PrismaService } from "nestjs-prisma"

import { HistoriesService } from "@/histories/histories.service"

describe("HistoriesService", () => {
  let service: HistoriesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, HttpModule],
      providers: [HistoriesService, PrismaService]
    }).compile()

    service = module.get<HistoriesService>(HistoriesService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })
})
