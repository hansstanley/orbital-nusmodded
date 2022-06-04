import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import { Course } from 'src/course/course.entity';
import { CourseMod, CourseModGroup, ModGroupMod } from './entities/relations';
import { Mod } from 'src/mod/mod.entity';
import { ModGroup } from 'src/mod-group/mod-group.entity';

const configService = new ConfigService();

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize(configService.get<string>('DATABASE_URL'));
      sequelize.addModels([
        Course,
        CourseMod,
        CourseModGroup,
        Mod,
        ModGroup,
        ModGroupMod
      ]);
      await sequelize.sync();
      return sequelize;
    }
  }
];