import { Test, TestingModule } from '@nestjs/testing';
import { ScenarioCodesService } from './scenario_codes.service';

describe('ScenarioCodesService', () => {
  let service: ScenarioCodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScenarioCodesService],
    }).compile();

    service = module.get<ScenarioCodesService>(ScenarioCodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
