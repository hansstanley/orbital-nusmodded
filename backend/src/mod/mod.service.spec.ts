import { Test, TestingModule } from '@nestjs/testing';
import { ModService } from './mod.service';

describe('ModService', () => {
  let service: ModService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModService],
    }).compile();

    service = module.get<ModService>(ModService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
