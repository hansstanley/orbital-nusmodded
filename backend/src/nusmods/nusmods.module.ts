import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NusmodsService } from './nusmods.service';

@Module({
  imports: [HttpModule],
  providers: [NusmodsService],
  exports: [NusmodsService]
})
export class NusmodsModule { }
