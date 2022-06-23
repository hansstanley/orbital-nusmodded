import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { courseProviders } from './course.providers';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { ModModule } from 'src/mod/mod.module';
import { ModGroupModule } from 'src/mod-group/mod-group.module';

@Module({
  imports: [
    DatabaseModule,
    ModModule,
    ModGroupModule
  ],
  providers: [
    CourseService,
    ...courseProviders
  ],
  controllers: [CourseController],
  exports: [CourseService]
})
export class CourseModule { }
