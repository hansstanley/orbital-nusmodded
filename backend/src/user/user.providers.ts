import { REPO } from "src/utils/constants";
import { Profile } from "./profile.entity";

export const userProviders = [
  {
    provide: REPO.PROFILE,
    useValue: Profile
  }
];