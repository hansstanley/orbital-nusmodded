import { useEffect, useState } from "react";
import { CourseInfoContext } from "../contexts";
import { CourseInfoService } from "../services/courseInfo";

export default function CoursesInfoProvider(props) {
  const { children } = props;
  const [courseInfoService, setCourseInfoService] = useState(
    new CourseInfoService()
  );
  const [isCoursesLoaded, setIsCoursesLoaded] = useState(false);
  const [courseList, setCourseList] = useState([]);
  const [courseMap, setCourseMap] = useState(new Map());

  useEffect(() => {
    const foo = async () => {
      const loadedService = await courseInfoService.buildCourses();
      console.log(courseInfoService.buildCourses);
      setCourseInfoService(loadedService);
      setCourseList(courseInfoService.getCourseList());
      setCourseMap(courseInfoService.getCourseMap());
      setIsCoursesLoaded(true);
    };
    // foo(); // Disabled here
  }, [courseInfoService]);

  return (
    <CourseInfoContext.Provider
      value={{
        courseMap: courseMap,
        courseList: courseList,
        isCoursesLoaded: isCoursesLoaded,
      }}
    >
      {children}
    </CourseInfoContext.Provider>
  );
}
