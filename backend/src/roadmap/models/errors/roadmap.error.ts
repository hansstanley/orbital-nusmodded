import { ModGroup } from "src/mod-group/mod-group.entity";
import { Mod } from "src/mod/mod.entity";

export class RoadmapError {
  mods?: Mod[];
  modGroups?: ModGroup[];
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  addMods(...mods: Mod[]) {
    this.mods = this.mods.concat(mods);
    return this;
  }

  addModGroups(...modGroups: ModGroup[]) {
    this.modGroups = this.modGroups.concat(modGroups);
    return this;
  }
}