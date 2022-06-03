import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { courseProviders } from './course.providers';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';

@Module({
  imports: [DatabaseModule],
  providers: [
    CourseService,
    ...courseProviders
  ],
  controllers: [CourseController]
})
export class CourseModule { }
