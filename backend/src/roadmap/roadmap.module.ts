import { Module } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { RoadmapController } from './roadmap.controller';
import { NusmodsModule } from 'src/nusmods/nusmods.module';
import { CourseModule } from 'src/course/course.module';
import { ModModule } from 'src/mod/mod.module';

@Module({
  imports: [
    CourseModule,
    ModModule,
    NusmodsModule
  ],
  providers: [RoadmapService],
  controllers: [RoadmapController]
})
export class RoadmapModule { }
