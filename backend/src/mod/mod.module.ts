import { Module } from '@nestjs/common';
import { ModService } from './mod.service';
import { ModController } from './mod.controller';

@Module({
  providers: [ModService],
  controllers: [ModController]
})
export class ModModule {}
