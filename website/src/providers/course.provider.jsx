import { plainToInstance } from "class-transformer";
import { useCallback, useContext } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { Course, Mod } from "../models";
import { useBackend } from "./backend.provider";
import { useState } from "react";
import { useAccessToken } from "./access-token.provider";
import { useSnackbar } from "./snackbar.provider";

const CourseContext = createContext({
  loading: false,
  getCourseArray: () => [],
  getCourseMap: () => new Map(),
  getCourse: (courseId) => new Course({ id: courseId }),
  getCourseMods: async (courseId) => [],
});

function CourseProvider({ children }) {
  const { hasAccess } = useAccessToken();
  const { makeRequest } = useBackend();
  const { pushSnack } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [courseMap, setCourseMap] = useState(new Map());

  useEffect(() => {
    async function buildCourses() {
      setLoading(true);

      try {
        const { status, data } = await makeRequest({
          method: "get",
          route: "/course",
          isPublic: false,
        });

        if (status === 200 && Array.isArray(data)) {
          const map = new Map();
          for (let raw of data) {
            const course = plainToInstance(Course, raw);
            map.set(course.id, course);
          }
          setCourseMap(map);
        } else {
          throw new Error(`Error loading courses with status ${status}`);
        }
      } catch (error) {
        console.error(error);
        pushSnack({
          message: error.message || "Error loading courses",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    if (hasAccess) buildCourses();
  }, [hasAccess, makeRequest, pushSnack]);

  const getCourseArray = useCallback(
    () => Array.from(courseMap.values()),
    [courseMap]
  );

  const getCourseMap = useCallback(() => courseMap, [courseMap]);

  const getCourse = useCallback(
    (courseId) => courseMap.get(courseId),
    [courseMap]
  );

  const getCourseMods = async (courseId) => {
    const { status, data } = await makeRequest({
      method: "get",
      route: `/course/${courseId}/modules`,
      isPublic: false,
    });

    if (status === 200 && Array.isArray(data)) {
      return data.map((raw) => plainToInstance(Mod, raw));
    } else {
      throw new Error(
        `Unable to retrieve modules for course ${courseMap.get(courseId).id}`
      );
    }
  };

  const values = {
    loading,
    getCourseArray,
    getCourseMap,
    getCourse,
    getCourseMods,
  };

  return (
    <CourseContext.Provider value={values}>{children}</CourseContext.Provider>
  );
}

function useCourse() {
  const context = useContext(CourseContext);
  if (!(context ?? false)) {
    throw new Error("useCourse must be used within an CourseProvider");
  }

  return context;
}

export { CourseProvider, useCourse };
