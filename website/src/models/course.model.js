export default class Course {
  id; // UUID V4
  title; // Title of the course
  department; // E.g. faculty, school, college
  description;
  url;
  createdAt;
  updatedAt;

  constructor({
    id,
    title,
    department,
    description,
    url,
    createdAt,
    updatedAt,
  } = {}) {
    this.id = id;
    this.title = title;
    this.department = department;
    this.description = description;
    this.url = url;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
