import { Module } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { RoadmapController } from './roadmap.controller';
import { NusmodsModule } from 'src/nusmods/nusmods.module';

@Module({
  imports: [NusmodsModule],
  providers: [RoadmapService],
  controllers: [RoadmapController]
})
export class RoadmapModule { }
