import { instanceToInstance } from "class-transformer";

export default class Profile {
  id = undefined;
  email = undefined;
  username = undefined;
  avatarUrl = undefined;
  roadmap = undefined;

  updateProperty(key, value) {
    if (this.hasOwnProperty(key)) {
      const profile = instanceToInstance(this);
      profile[key] = value;
      return profile;
    } else {
      return this;
    }
  }
}
