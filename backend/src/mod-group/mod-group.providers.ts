import { REPO } from "src/utils/constants";
import { ModGroup } from "./mod-group.entity";

export const modGroupProviders = [
  {
    provide: REPO.MOD_GROUP,
    useValue: ModGroup
  }
];