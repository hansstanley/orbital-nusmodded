import { REPO } from "src/utils/constants";
import { Mod } from "./mod.entity";

export const modProviders = [
  {
    provide: REPO.MOD,
    useValue: Mod
  }
];