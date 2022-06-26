export default class Course {
  id; // UUID V4
  title; // Title of the course
  department; // E.g. faculty, school, college
  description;
  createdAt;
  updatedAt;

  constructor({
    id,
    title,
    department,
    description,
    createdAt,
    updatedAt,
  } = {}) {
    this.id = id;
    this.title = title;
    this.department = department;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
