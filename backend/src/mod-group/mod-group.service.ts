import { Inject, Injectable, Logger } from '@nestjs/common';
import { REPO } from 'src/utils/constants';
import { ModGroup } from './mod-group.entity';

@Injectable()
export class ModGroupService {
  private readonly logger = new Logger(ModGroupService.name);

  constructor(
    @Inject(REPO.MOD_GROUP)
    private modGroupRepository: typeof ModGroup
  ) { }
}
