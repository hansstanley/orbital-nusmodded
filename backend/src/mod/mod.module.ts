import { Module } from '@nestjs/common';
import { ModService } from './mod.service';
import { ModController } from './mod.controller';
import { modProviders } from './mod.providers';
import { DatabaseModule } from 'src/database/database.module';
import { NusmodsModule } from 'src/nusmods/nusmods.module';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [
    DatabaseModule,
    NusmodsModule
  ],
  providers: [ModService, ...modProviders],
  controllers: [ModController],
  exports: [ModService]
})
export class ModModule { }
