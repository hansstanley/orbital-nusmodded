import { Test, TestingModule } from '@nestjs/testing';
import { ModGroupService } from './mod-group.service';

describe('ModGroupService', () => {
  let service: ModGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModGroupService],
    }).compile();

    service = module.get<ModGroupService>(ModGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
