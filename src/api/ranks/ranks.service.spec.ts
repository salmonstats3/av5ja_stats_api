import { Test, TestingModule } from "@nestjs/testing";
import { RanksService } from "./ranks.service";

describe("RanksService", () => {
  let service: RanksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RanksService],
    }).compile();

    service = module.get<RanksService>(RanksService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
