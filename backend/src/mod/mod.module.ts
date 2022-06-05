import { Module } from '@nestjs/common';
import { ModService } from './mod.service';
import { ModController } from './mod.controller';
import { modProviders } from './mod.providers';

@Module({
  providers: [ModService, ...modProviders],
  controllers: [ModController]
})
export class ModModule { }
