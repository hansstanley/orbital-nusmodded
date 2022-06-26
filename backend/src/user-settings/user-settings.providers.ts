import { REPO } from "src/utils/constants";
import { UserSettings } from "./user-settings.entity";

export const userSettingsProviders = [
  {
    provide: REPO.USER_SETTINGS,
    useValue: UserSettings
  }
];