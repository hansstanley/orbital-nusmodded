import axios from "axios";
import CourseInfo from "./courseInfo.class.js";
import { plainToInstance } from "class-transformer";

const BACKEND_API = `https://nusmodded.herokuapp.com`;

export default class CourseInfoService {
  #courses = new Map();

  #getAllCourses = async () => {
    console.log("Retrieving all courses info...");
    const allCoursesInfo = await axios.get(BACKEND_API + "/course");
    console.log("Retrieved all courses!");
    return allCoursesInfo;
  };

  /**
   * Loads the course information from our backend.
   * @returns This instance of CourseService.
   */
  buildCourses = async () => {
    const detailedInfo = await this.#getAllCourses();
    detailedInfo.data.forEach((info) => {
      const courseInfo = plainToInstance(CourseInfo, info);
      this.#courses.set(courseInfo.id, courseInfo);
    });
    return this;
  };

  /**
   * Returns a list of all courses.
   * @returns An array of courses.
   */
  getCourseList = () => {
    return Array.from(this.#courses.values());
  };

  getCourseMap = () => {
    return this.#courses;
  };

  addCourse = (title, department, description) => {
    axios.post(BACKEND_API + "/course/new", {
      title: title,
      department: department,
      description: description
    });
  }

}
