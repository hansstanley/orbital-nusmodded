import { Test, TestingModule } from '@nestjs/testing';
import { ModGroupController } from './mod-group.controller';

describe('ModGroupController', () => {
  let controller: ModGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModGroupController],
    }).compile();

    controller = module.get<ModGroupController>(ModGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
