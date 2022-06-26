import { ModGroup } from "src/mod-group/mod-group.entity";
import { Mod } from "src/mod/mod.entity";

export class RoadmapError {
  affectedMods?: Mod[];
  affectedModGroups?: ModGroup[];
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  addMods(...mods: Mod[]) {
    this.affectedMods = (this.affectedMods ?? []).concat(mods);
    return this;
  }

  addModGroups(...modGroups: ModGroup[]) {
    this.affectedModGroups = (this.affectedModGroups ?? [])
      .concat(modGroups);
    return this;
  }
}