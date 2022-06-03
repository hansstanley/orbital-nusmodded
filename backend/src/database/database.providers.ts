import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import { Course } from 'src/course/course.entity';

const configService = new ConfigService();

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize(configService.get<string>('DATABASE_URL'));
      sequelize.addModels([Course]);
      await sequelize.sync();
      return sequelize;
    }
  }
];