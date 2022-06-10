import { Mod } from "src/mod/mod.entity";
import { RoadmapError } from "./roadmap.error";

export class PrerequisiteError extends RoadmapError {
  constructor(target: Mod, prereq: Mod, remark?: string) {
    super(`${prereq.moduleCode} is a prerequisite for ${target.moduleCode}`);
    this.addMods(target);
    if (remark) this.message += ` ($${remark})`;
  }
}