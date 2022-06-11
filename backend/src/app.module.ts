import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CourseModule } from './course/course.module';
import { NusmodsModule } from './nusmods/nusmods.module';
import { ModModule } from './mod/mod.module';
import { ModGroupModule } from './mod-group/mod-group.module';
import { RoadmapModule } from './roadmap/roadmap.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CourseModule,
    NusmodsModule,
    ModModule,
    ModGroupModule,
    RoadmapModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
