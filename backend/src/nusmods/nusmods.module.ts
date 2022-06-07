import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NusmodsService } from './nusmods.service';
import { NusmodsController } from './nusmods.controller';

@Module({
  imports: [HttpModule],
  providers: [NusmodsService],
  exports: [NusmodsService],
  controllers: [NusmodsController]
})
export class NusmodsModule { }
