import { Test, TestingModule } from "@nestjs/testing"
import { PrismaService } from "nestjs-prisma"

import { HistoriesController } from "@/histories/histories.controller"
import { HistoriesService } from "@/histories/histories.service"

describe("HistoriesController", () => {
  let controller: HistoriesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoriesController],
      imports: [],
      providers: [HistoriesService, PrismaService]
    }).compile()

    controller = module.get<HistoriesController>(HistoriesController)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })
})
