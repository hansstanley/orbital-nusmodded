import { Course } from "../course.entity";

export class CourseDto {
  id: string;
  name: string;
  description: string;

  constructor(course: Course) {
    this.id = course.id;
    this.name = course.name;
    this.description = course.description;
  }
}