import { useCallback, useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { v4, validate as uuidValidate, version as uuidVersion } from "uuid";
import { ROADMAP } from "../utils/constants";
import { useAuthSession } from "./auth-session.provider";
import { useBackend } from "./backend.provider";
import { useSnackbar } from "./snackbar.provider";

const RoadmapContext = createContext({
  loading: false,
  roadmap: [],
  addSemester: ({ id, year, semester, modules = [] }) => {},
  getSemesters: () => [],
  getSemesterById: (id) => ({ id }),
  deleteSemesterById: (id) => ({ id }),
  setPropertyById: (id, propertyKey, propertyValue) => {},
  setYearById: (id, year) => {},
  setSemesterById: (id, semester) => {},
  setModulesById: (id, modules = []) => {},
  dragSemesters: (srcIndex, destIndex) => {},
  dragMods: (srcIndex, srcDroppableId, destIndex, destDroppableId) => {},
});

function RoadmapProvider({ children }) {
  const { isAuth } = useAuthSession();
  const { makeRequest } = useBackend();
  const { pushSnack } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState([]);

  useEffect(() => {
    function maintainRoadmap(roadmap = []) {
      const newRoadmap = Array.isArray(roadmap) ? [...roadmap] : [];

      const isEmpty = newRoadmap.length === 0;
      const hasMyMods =
        newRoadmap.findIndex((sem) => sem?.id === ROADMAP.MY_MODS_ID) !== -1;
      const hasCourseMods =
        newRoadmap.findIndex((sem) => sem?.id === ROADMAP.COURSE_MODS_ID) !==
        -1;

      if (isEmpty) {
        newRoadmap.push(...ROADMAP.TEMPLATE());
      }
      if (!hasMyMods) {
        newRoadmap.push({ id: ROADMAP.MY_MODS_ID, modules: [] });
      }
      if (!hasCourseMods) {
        newRoadmap.push({ id: ROADMAP.COURSE_MODS_ID, modules: [] });
      }

      setRoadmap(newRoadmap);
    }

    async function init() {
      setLoading(true);
      try {
        const { status, data } = await makeRequest({
          method: "get",
          route: "/user-settings",
          isPublic: false,
        });

        if (status === 200) {
          maintainRoadmap(data?.ROADMAP);
        } else {
          throw new Error(`Failed to retrieve roadmap with status ${status}`);
        }
      } catch (error) {
        console.error(error);
        pushSnack({
          message: "Unable to retrieve roadmap",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    if (isAuth()) init();
  }, [isAuth, makeRequest, pushSnack]);

  useEffect(() => {
    async function saveRoadmap() {
      try {
        const { status } = await makeRequest({
          method: "post",
          route: "/user-settings/edit",
          data: {
            key: "ROADMAP",
            value: roadmap,
          },
          isPublic: false,
        });

        if (status !== 200) {
          throw new Error("Unable to save roadmap");
        }
      } catch (error) {
        console.error(error);
        pushSnack({
          message: "Unable to save roadmap",
          severity: "error",
        });
      }
    }

    if (isAuth() && Array.isArray(roadmap) && roadmap.length) saveRoadmap();
  }, [isAuth, roadmap, makeRequest, pushSnack]);

  const addSemester = useCallback(
    ({ id = v4(), year, semester, modules = [] }) => {
      const newRoadmap = [...roadmap];
      newRoadmap.push({ id, year, semester, modules });
      setRoadmap(newRoadmap);
    },
    [roadmap]
  );

  const getSemesters = useCallback(
    () =>
      roadmap.filter(
        (sem) => sem?.id && uuidValidate(sem.id) && uuidVersion(sem.id) === 4
      ),
    [roadmap]
  );

  const getNonSemesters = useCallback(
    () =>
      roadmap.filter(
        (sem) => sem?.id && uuidValidate(sem.id) && uuidVersion(sem.id) !== 4
      ),
    [roadmap]
  );

  const getSemesterById = useCallback(
    (id) => roadmap.find((sem) => sem?.id === id),
    [roadmap]
  );

  const deleteSemesterById = useCallback(
    (id) => {
      const index = roadmap.findIndex((sem) => sem?.id === id);
      if (index === -1) return null;

      const newRoadmap = [...roadmap];
      const [deleted] = newRoadmap.splice(index, 1);

      setRoadmap(newRoadmap);
      return deleted;
    },
    [roadmap]
  );

  const setPropertyById = useCallback(
    (id, propertyKey, propertyValue) => {
      const targetIndex = roadmap.findIndex((sem) => sem?.id === id);
      if (targetIndex === -1) throw new Error(`Semester ${id} does not exist`);

      const { [propertyKey]: ignored, ...others } = roadmap[targetIndex];
      const newRoadmap = [...roadmap];
      newRoadmap.splice(targetIndex, 1, {
        [propertyKey]: propertyValue,
        ...others,
      });
      setRoadmap(newRoadmap);
    },
    [roadmap]
  );

  const setYearById = useCallback(
    (id, year) => {
      setPropertyById(id, "year", year);
    },
    [setPropertyById]
  );

  const setSemesterById = useCallback(
    (id, semester) => {
      setPropertyById(id, "semester", semester);
    },
    [setPropertyById]
  );

  const setModulesById = useCallback(
    (id, modules = []) => {
      setPropertyById(id, "modules", modules);
    },
    [setPropertyById]
  );

  const dragSemesters = useCallback(
    (srcIndex, destIndex) => {
      const semesters = getSemesters();
      const [dragged] = semesters.splice(srcIndex, 1);
      semesters.splice(destIndex, 0, dragged);
      setRoadmap([...semesters, ...getNonSemesters()]);
    },
    [getSemesters, getNonSemesters]
  );

  const dragMods = useCallback(
    (srcIndex, srcDroppableId, destIndex, destDroppableId) => {
      const srcDroppable = getSemesterById(srcDroppableId);
      const destDroppable = getSemesterById(destDroppableId);

      const [dragged] = srcDroppable.modules.splice(srcIndex, 1);
      destDroppable.modules.splice(destIndex, 0, dragged);

      const newRoadmap = roadmap.map((sem) => {
        switch (sem.id) {
          case srcDroppable.id:
            return srcDroppable;
          case destDroppable.id:
            return destDroppable;
          default:
            return sem;
        }
      });

      setRoadmap(newRoadmap);
    },
    [roadmap, getSemesterById]
  );

  const values = {
    loading,
    roadmap,
    addSemester,
    getSemesters,
    getSemesterById,
    deleteSemesterById,
    setPropertyById,
    setYearById,
    setSemesterById,
    setModulesById,
    dragSemesters,
    dragMods,
  };

  return (
    <RoadmapContext.Provider value={values}>{children}</RoadmapContext.Provider>
  );
}

function useRoadmap() {
  const context = useContext(RoadmapContext);
  if (!(context ?? false)) {
    throw new Error("useRoadmap must be used within an RoadmapProvider");
  }

  return context;
}

export { RoadmapProvider, useRoadmap };
