import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import { Course } from 'src/course/course.entity';
import { CourseMod, CourseModGroup, ModGroupMod } from './entities/relations';
import { Mod } from 'src/mod/mod.entity';
import { ModGroup } from 'src/mod-group/mod-group.entity';
import { CONFIG, SEQUELIZE } from 'src/utils/constants';

const configService = new ConfigService();

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      const sequelize = new Sequelize(
        configService.get<string>(CONFIG.DATABASE_URL)
      );

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