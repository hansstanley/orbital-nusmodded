import { Test, TestingModule } from '@nestjs/testing';
import { ModController } from './mod.controller';

describe('ModController', () => {
  let controller: ModController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModController],
    }).compile();

    controller = module.get<ModController>(ModController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
