import { Test, TestingModule } from '@nestjs/testing';
import { ScenarioCodesController } from './scenario_codes.controller';

describe('ScenarioCodesController', () => {
  let controller: ScenarioCodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScenarioCodesController],
    }).compile();

    controller = module.get<ScenarioCodesController>(ScenarioCodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
