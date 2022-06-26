import { Module } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { UserSettingsController } from './user-settings.controller';
import { userSettingsProviders } from './user-settings.providers';

@Module({
  providers: [
    UserSettingsService,
    ...userSettingsProviders
  ],
  controllers: [UserSettingsController]
})
export class UserSettingsModule { }
