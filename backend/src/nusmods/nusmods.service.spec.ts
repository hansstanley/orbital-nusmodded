import { Test, TestingModule } from '@nestjs/testing';
import { NusmodsService } from './nusmods.service';

describe('NusmodsService', () => {
  let service: NusmodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NusmodsService],
    }).compile();

    service = module.get<NusmodsService>(NusmodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
