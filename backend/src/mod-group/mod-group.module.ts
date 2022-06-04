import { Module } from '@nestjs/common';
import { ModGroupService } from './mod-group.service';
import { ModGroupController } from './mod-group.controller';

@Module({
  providers: [ModGroupService],
  controllers: [ModGroupController]
})
export class ModGroupModule {}
