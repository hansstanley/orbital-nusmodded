import { createContext } from "react";

const CourseInfoContext = createContext(() => ({
  courseMap: [],
  isCoursesLoaded: false,
  addCourse: () => {},
}));

export default CourseInfoContext;
