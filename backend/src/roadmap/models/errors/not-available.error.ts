import { Mod } from "src/mod/mod.entity";
import { SemesterDto } from "src/roadmap/dto";
import { RoadmapError } from "./roadmap.error";

export class NotAvailableError extends RoadmapError {
  constructor(target: Mod, semester: SemesterDto) {
    super(`${target.moduleCode} is not available in ${semester.id < 3
      ? 'Semester ' + semester.id
      : 'Special term ' + semester.id % 2}`);

    this.addMods(target);
  }
}