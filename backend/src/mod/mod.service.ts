import { Inject, Injectable, Logger } from '@nestjs/common';
import { REPO } from 'src/utils/constants';
import { Mod } from './mod.entity';

@Injectable()
export class ModService {
  private readonly logger = new Logger(ModService.name);

  constructor(
    @Inject(REPO.MOD)
    private modRepository: typeof Mod
  ) { }
}
