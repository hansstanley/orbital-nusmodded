import { Module } from '@nestjs/common';
import { ModGroupService } from './mod-group.service';
import { ModGroupController } from './mod-group.controller';
import { modGroupProviders } from './mod-group.providers';

@Module({
  providers: [ModGroupService, ...modGroupProviders],
  controllers: [ModGroupController]
})
export class ModGroupModule { }
