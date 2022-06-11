import { Course } from "src/course/course.entity";
import { ModGroup } from "src/mod-group/mod-group.entity";
import { Mod } from "src/mod/mod.entity";
import { RoadmapError } from "./roadmap.error";

export class CourseReqError extends RoadmapError {
  constructor(
    target: Mod | ModGroup,
    course: Course
  ) {
    super('');

    if (target instanceof Mod) {
      this.addMods(target);
      this.message += `${target.moduleCode} is required`;
    } else {
      this.addModGroups(target);
      this.message += `${target.minimum} to ${target.maximum} of `;
      this.message += target.mods
        .map((mod) => mod.moduleCode)
        .join(', ');
    }
    this.message += ` for course ${course.title}`;
  }
}