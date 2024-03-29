import { Module } from '@nestjs/common';
import { ModGroupService } from './mod-group.service';
import { ModGroupController } from './mod-group.controller';
import { modGroupProviders } from './mod-group.providers';
import { DatabaseModule } from 'src/database/database.module';
import { ModModule } from 'src/mod/mod.module';

@Module({
  imports: [
    DatabaseModule,
    ModModule
  ],
  providers: [ModGroupService, ...modGroupProviders],
  controllers: [ModGroupController],
  exports: [ModGroupService]
})
export class ModGroupModule { }
