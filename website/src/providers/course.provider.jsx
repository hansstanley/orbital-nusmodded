import { plainToInstance } from "class-transformer";
import { useCallback, useContext } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { Course, Mod, ModGroup } from "../models";
import { useBackend } from "./backend.provider";
import { useState } from "react";
import { useSnackbar } from "./snackbar.provider";

const CourseContext = createContext({
  loading: false,
  getCourseArray: () => [],
  getCourseMap: () => new Map(),
  getCourse: (courseId) => new Course({ id: courseId }),
  getCourseMods: async (courseId) => [],
  getCourseModGroups: async (courseId) => [],
  bindCourseMods: async (courseId, { type, moduleCodes }) => [],
  unbindCourseMods: async (courseId, moduleCodes) => 0,
  createCourse: async (data) => new Course(),
  updateCourse: async (courseId, data) => new Course(),
  deleteCourse: async (courseId) => new Course(),
});

function CourseProvider({ children }) {
  const { makeRequest } = useBackend();
  const { pushSnack } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [courseMap, setCourseMap] = useState(new Map());

  useEffect(() => {
    async function buildCourses() {
      setLoading(true);

      try {
        const { status, data } = await makeRequest({
          method: "get",
          route: "/course",
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
        setRefresh(false);
      }
    }

    if (refresh) buildCourses();
  }, [refresh, makeRequest, pushSnack]);

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
    });

    if (status === 200 && Array.isArray(data)) {
      return data.map((raw) => plainToInstance(Mod, raw));
    } else {
      throw new Error(`Unable to retrieve modules for course ${courseId}`);
    }
  };

  const getCourseModGroups = async (courseId) => {
    const { status, data } = await makeRequest({
      method: "get",
      route: `/course/${courseId}/module-groups`,
    });

    if (status === 200 && Array.isArray(data)) {
      return data.map((raw) => plainToInstance(ModGroup, raw));
    } else {
      throw new Error(
        `Unable to retrieve module groups for course ${courseId}`
      );
    }
  };

  const bindCourseMods = async (
    courseId,
    { type = "Core", moduleCodes = [] }
  ) => {
    const { status, data } = await makeRequest({
      method: "post",
      route: `/course/${courseId}/add-modules`,
      data: { type, moduleCodes },
      isPublic: false,
    });

    if (status === 200 && Array.isArray(data?.bound)) {
      const unbound = moduleCodes.filter((code) => !data.bound.includes(code));
      if (unbound.length) console.error("Unable to bind", unbound);
      return data.bound;
    } else {
      throw new Error(`Unable to bind modules to course ${courseId}`);
    }
  };

  const unbindCourseMods = async (courseId, moduleCodes = []) => {
    const { status, data } = await makeRequest({
      method: "post",
      route: `/course/${courseId}/remove-modules`,
      data: { moduleCodes },
      isPublic: false,
    });

    if (status === 200 && data) {
      return data.count;
    } else {
      throw new Error(`Unable to unbind modules from course ${courseId}`);
    }
  };

  const createCourse = async ({ title, department, description }) => {
    const { status, data } = await makeRequest({
      method: "post",
      route: "/course/new",
      data: { title, department, description },
      isPublic: false,
    });

    if (status === 201 && data) {
      setRefresh(true);
      return plainToInstance(Course, data);
    } else {
      throw new Error(`Unable to create course ${title}`);
    }
  };

  const updateCourse = async (courseId, { title, department, description }) => {
    const params = {};
    if (title) params.title = title;
    if (department) params.department = department;
    if (description) params.description = description;

    const { status, data } = await makeRequest({
      method: "post",
      route: `/course/${courseId}/edit`,
      data: params,
      isPublic: false,
    });

    if (status === 200 && data) {
      setRefresh(true);
      return plainToInstance(Course, data);
    } else {
      throw new Error(`Unable to update course ${courseId}`);
    }
  };

  const deleteCourse = async (courseId) => {
    const { status, data } = await makeRequest({
      method: "delete",
      route: `/course/${courseId}`,
      isPublic: false,
    });

    if (status === 200) {
      setRefresh(true);
      return plainToInstance(Course, data);
    } else {
      throw new Error(`Unable to delete course ${courseId}`);
    }
  };

  const values = {
    loading,
    getCourseArray,
    getCourseMap,
    getCourse,
    getCourseMods,
    getCourseModGroups,
    bindCourseMods,
    unbindCourseMods,
    createCourse,
    updateCourse,
    deleteCourse,
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
