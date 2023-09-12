import { Test, TestingModule } from '@nestjs/testing';
import { Av5jaService } from './av5ja.service';

describe('Av5jaService', () => {
  let service: Av5jaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Av5jaService],
    }).compile();

    service = module.get<Av5jaService>(Av5jaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
