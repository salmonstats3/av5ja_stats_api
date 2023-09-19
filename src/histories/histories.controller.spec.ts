import { Test, TestingModule } from '@nestjs/testing';

import { HistoriesController } from './histories.controller';

describe('HistoriesController', () => {
  let controller: HistoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoriesController],
    }).compile();

    controller = module.get<HistoriesController>(HistoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
