import { Inject, Injectable } from '@nestjs/common';
import { REPO, USER_SETTINGS, USER_SETTINGS_DEFAULT } from 'src/utils/constants';
import { UserSettingsKeys } from 'src/utils/types';
import { UserSettings } from './user-settings.entity';

@Injectable()
export class UserSettingsService {
  constructor(
    @Inject(REPO.USER_SETTINGS)
    private userSettingsRepository: typeof UserSettings
  ) { }

  async find(
    profileId: string,
    key: UserSettingsKeys
  ): Promise<UserSettings> {
    return this.userSettingsRepository.findOne({
      where: { profileId, key }
    });
  }

  private async create(
    profileId: string,
    key: UserSettingsKeys,
    value: string
  ): Promise<UserSettings> {
    let setting = await this.find(profileId, key);

    if (!setting) {
      setting = new UserSettings({ profileId, key });
    }

    setting.value = value;
    return setting.save();
  }

  async getSettings(profileId: string) {
    const keys = USER_SETTINGS;
    const values = await Promise.all([
      this.getHonors(profileId),
      this.getModuleCreditLimit(profileId),
      this.getCourseId(profileId)
    ]);

    const result = {};
    for (let i = 0; i < keys.length; i++) {
      result[keys[i]] = values[i];
    }

    return result;
  }

  async getHonors(profileId: string): Promise<boolean> {
    const setting = await this.find(profileId, 'IS_HONORS');

    if (setting) {
      return setting.value === 'true';
    } else {
      return USER_SETTINGS_DEFAULT.IS_HONORS;
    }
  }

  async setHonors(
    profileId: string,
    isHonors: boolean
  ): Promise<UserSettings> {
    return this.create(profileId, 'IS_HONORS', `${isHonors}`);
  }

  async getModuleCreditLimit(profileId: string): Promise<number> {
    const setting = await this.find(profileId, 'MC_LIMIT');

    if (setting) {
      return parseInt(setting.value, 10);
    } else {
      return USER_SETTINGS_DEFAULT.MC_LIMIT;
    }
  }

  async setModuleCreditLimit(
    profileId: string,
    limit: number
  ): Promise<UserSettings> {
    return this.create(profileId, 'MC_LIMIT', limit.toString());
  }

  async getCourseId(profileId: string): Promise<string> {
    const setting = await this.find(profileId, 'COURSE_ID');

    if (setting) {
      return setting.value;
    } else {
      return USER_SETTINGS_DEFAULT.COURSE_ID;
    }
  }

  async setCourseId(
    profileId: string,
    courseId: string
  ): Promise<UserSettings> {
    return this.create(profileId, 'COURSE_ID', courseId);
  }
}
