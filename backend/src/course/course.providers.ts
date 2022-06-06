import { REPO } from "src/utils/constants";
import { Course } from "./course.entity";

export const courseProviders = [
  {
    provide: REPO.COURSE,
    useValue: Course
  }
];