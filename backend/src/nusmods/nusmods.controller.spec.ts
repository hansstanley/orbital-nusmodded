import { Test, TestingModule } from '@nestjs/testing';
import { NusmodsController } from './nusmods.controller';

describe('NusmodsController', () => {
  let controller: NusmodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NusmodsController],
    }).compile();

    controller = module.get<NusmodsController>(NusmodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
