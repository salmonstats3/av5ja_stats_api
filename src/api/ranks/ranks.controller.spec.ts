import { Test, TestingModule } from "@nestjs/testing";
import { RanksController } from "./ranks.controller";

describe("RanksController", () => {
  let controller: RanksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RanksController],
    }).compile();

    controller = module.get<RanksController>(RanksController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
