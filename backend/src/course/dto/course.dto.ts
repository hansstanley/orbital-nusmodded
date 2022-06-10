import { Course } from "../course.entity";

export class CourseDto {
  id: string;
  title: string;
  description: string;
  department: string;

  constructor(course: Course) {
    this.id = course.id;
    this.title = course.title;
    this.description = course.description;
    this.department = course.department;
  }
}