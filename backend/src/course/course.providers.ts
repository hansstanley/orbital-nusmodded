import { Course } from "./course.entity";

export const courseProviders = [
  {
    provide: 'COURSE_REPOSITORY',
    useValue: Course
  }
];