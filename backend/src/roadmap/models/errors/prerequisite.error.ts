import { Mod } from "src/mod/mod.entity";
import { RoadmapError } from "./roadmap.error";

export class PrerequisiteError extends RoadmapError {
  constructor(
    target: Mod,
    prereqs: Mod[],
    type: 'and' | 'or' = 'and'
  ) {
    super('');
    this.addMods(target);

    if (prereqs.length === 1) {
      this.message += `${prereqs[0].moduleCode} is a prerequisite`;
    } else {
      this.message += prereqs
        .slice(0, -1)
        .map((mod) => mod.moduleCode)
        .join(', ');
      this.message += ` ${type} ${prereqs[prereqs.length - 1]} are prerequisites`;
    }
    this.message += ` for ${target.moduleCode}`;
  }
}