import { Test, TestingModule } from '@nestjs/testing';
import { ScenarioController } from './scenario.controller';

describe('ScenarioController', () => {
  let controller: ScenarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScenarioController],
    }).compile();

    controller = module.get<ScenarioController>(ScenarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
