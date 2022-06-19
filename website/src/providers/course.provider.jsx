import { plainToInstance } from "class-transformer";
import { useCallback, useContext } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { Course } from "../models";
import { useBackend } from "./backend.provider";
import { useState } from "react";
import { useAccessToken } from "./access-token.provider";

const CourseContext = createContext({
  getCourseArray: () => [],
  getCourseMap: () => new Map(),
});

function CourseProvider({ children }) {
  const { hasAccess } = useAccessToken();
  const { makeRequest } = useBackend();
  const [courseMap, setCourseMap] = useState(new Map());

  useEffect(() => {
    async function buildCourses() {
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
      }
    }

    if (hasAccess) buildCourses();
  }, [hasAccess, makeRequest]);

  const getCourseArray = useCallback(
    () => Array.from(courseMap.values()),
    [courseMap]
  );

  const getCourseMap = useCallback(() => courseMap, [courseMap]);

  const values = {
    getCourseArray,
    getCourseMap,
  };

  return (
    <CourseContext.Provider value={values}>{children}</CourseContext.Provider>
  );
}

function useCourse() {
  const context = useContext(CourseContext);
  if (!(context ?? false)) {
    throw new Error("useContext must be used within an ContextProvider");
  }

  return context;
}

export { CourseProvider, useCourse };
