import { Test, TestingModule } from '@nestjs/testing';
import { Av5jaController } from './av5ja.controller';

describe('Av5jaController', () => {
  let controller: Av5jaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Av5jaController],
    }).compile();

    controller = module.get<Av5jaController>(Av5jaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
