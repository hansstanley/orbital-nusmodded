import { useCallback, useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { v4, validate as uuidValidate, version as uuidVersion } from "uuid";
import { ROADMAP, SETTINGS } from "../utils/constants";
import { useAuthSession } from "./auth-session.provider";
import { useBackend } from "./backend.provider";
import { useSnackbar } from "./snackbar.provider";
import { useCourse } from "./course.provider";
import { useMod } from "./mod.provider";
import { ModuleInfoContext } from "../contexts";
import { useSettings } from "./settings.provider";

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
  setBgColorById: (id, colorKey) => {},
  dragSemesters: (srcIndex, destIndex) => {},
  dragMods: (srcIndex, srcDroppableId, destIndex, destDroppableId) => {},
  getAllMods: () => [],
});

function RoadmapProvider({ children }) {
  const { isAuth } = useAuthSession();
  const { makeRequest } = useBackend();
  const { pushSnack } = useSnackbar();
  const { getCourseMods, getCourseModGroups, getCourseId } = useCourse();
  const { getModInfo, modMap } = useMod();
  const { loading: loadingSettings, getSetting } = useSettings();
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState([]);
  const [MCLimit, setMCLimit] = useState(0);
  const [exemptedModules, setExemptedModules] = useState([]);
  const [courseMods, setCourseMods] = useState([]);
  const [courseModGroups, setCourseModGroups] = useState([]);
  const { modules, isLoaded } = useContext(ModuleInfoContext);

  useEffect(() => {
    function maintainRoadmap(roadmap = []) {
      const newRoadmap = Array.isArray(roadmap) ? [...roadmap] : [];

      const isEmpty = newRoadmap.length === 0;
      const missingMyMods =
        newRoadmap.findIndex((sem) => sem?.id === ROADMAP.MY_MODS_ID) === -1;
      const missingMyModGroups =
        newRoadmap.findIndex((sem) => sem?.id === ROADMAP.MY_MOD_GROUPS_ID) ===
        -1;

      if (isEmpty) {
        newRoadmap.push(...ROADMAP.TEMPLATE());
      }
      if (missingMyMods) {
        newRoadmap.push({ id: ROADMAP.MY_MODS_ID, modules: [] });
      }
      if (missingMyModGroups) {
        newRoadmap.push({ id: ROADMAP.MY_MOD_GROUPS_ID, modules: [] });
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

        if (status === 200) {
          setMCLimit(data?.MC_LIMIT);
        } else {
          throw new Error(`Failed to retrieve MC limit with status ${status}`);
        }

        if (status === 200) {
          // setExemptedModules(data?.EXEMPTED_MODULES);
        } else {
          throw new Error(`Failed to retrieve exempted modules with status ${status}`);
        }

      } catch (error) {
        console.error(error);
        pushSnack({
          message: "Unable to retrieve roadmap/MC limit",
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

  useEffect(() => {
    async function loadModGroups() {
      const courseId = getSetting(SETTINGS.COURSE.ID);

      if (courseId) {
        const [cm, cmg] = await Promise.all([
          getCourseMods(courseId),
          getCourseModGroups(courseId),
        ]);

        setCourseMods(cm);
        setCourseModGroups(cmg);
      } else {
        setCourseMods([]);
        setCourseModGroups([]);
      }
    }

    if (!loadingSettings) loadModGroups();
  }, [loadingSettings, getSetting, getCourseMods, getCourseModGroups]);

  const getAllMods = useCallback(
    () =>
      roadmap
        .reduce((prev, currSem) => prev.concat(currSem?.modules || []), [])
        .map((mod) => (mod[0] === "^" ? mod.split("^")[3] : mod)),
    [roadmap]
  );

  const addSemester = useCallback(
    ({ id = v4(), year, semester, modules = [] }) => {
      const newRoadmap = [...roadmap];
      newRoadmap.push({ id, year, semester, modules });
      setRoadmap(newRoadmap);
      return id;
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

  const setBgColorById = useCallback(
    (id, colorKey) => {
      setPropertyById(id, "bgColor", colorKey);
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

  const checkSemestersMC = useCallback(
    (roadmap) => {
      if (isLoaded) {
        roadmap = roadmap.map((sem) =>
          sem.modules.map((mod) => (mod[0] === "^" ? mod.split("^")[3] : mod))
        );
        roadmap = roadmap.map((sem) =>
          sem.map((mod) =>
            mod !== ""
              ? modules.find((x) => x.moduleCode === mod).moduleCredit
              : 0
          )
        );
        roadmap = roadmap.map((sem) =>
          sem.reduce((a, b) => a + parseInt(b), 0)
        );
        roadmap = roadmap.map((sem) => sem > MCLimit);
      }
      if (roadmap.includes(true)) {
        pushSnack({
          message: "Semester exceeds MC Limit!",
          severity: "error",
        });
        return true;
      }
      return false;
    },
    [MCLimit, isLoaded, modules, pushSnack]
  );

  const checkSemestersPrereq = useCallback(
    (roadmap, module) => {
      const moduleCode = module[0] === "^" ? module.split("^")[3] : module;
      if (
        roadmap[roadmap.findIndex((sem) => sem.modules.includes(module))]
          .index === ROADMAP.MY_MODS_ID ||
        moduleCode === ""
      )
        return false;
      // const ignored = ["MA1301", "ES1000"];
      const prereq = modMap.get(moduleCode).prereqTree;
      let check = [];
      let pushSnackMessage = [];
      const newArr = roadmap
        .slice(
          0,
          roadmap.findIndex((sem) => sem.modules.includes(module))
        )
        .reduce((a, b) => a.concat(b.modules), [])
        .map((mod) =>
          mod[0] === "^"
            ? mod.split("^")[3]
            : mod === "CS1101S"
            ? "CS1010"
            : mod
        );
      if (!prereq) return;

      if (!prereq.and) {
        if (!prereq.or) {
          check.push(
              exemptedModules.some((x) => x.indexOf(prereq) >= 0) ||
              newArr.some((x) => x.indexOf(prereq) >= 0)
          );
          if (!check.includes(true)) {
            pushSnackMessage.push(prereq);
          }
        } else {
          check = prereq.or.map((or) => {
            if (!or.and) {
              const tf =
                exemptedModules.some((x) => x.indexOf(or) >= 0) ||
                newArr.some((x) => x.indexOf(or) >= 0);
              if (!tf) {
                pushSnackMessage.push(or);
              }
              return tf;
            } else {
              const tf = or.and
                .map(
                  (mod) =>
                    exemptedModules.some((x) => x.indexOf(mod) >= 0) ||
                    newArr.some((x) => x.indexOf(mod) >= 0)
                )
                .includes(true);
              if (!tf) {
                pushSnackMessage.push("(" + or.and.join(" and ") + ")");
              }
              return tf;
            }
          });
          if (!check.includes(true)) {
            pushSnackMessage = ["(" + pushSnackMessage.join(" or ") + ")"];
          } else {
            pushSnackMessage = [];
          }
        }
      } else {
        check = prereq.and.map((and) => {
          if (!and.or) {
            const tf =
              exemptedModules.some((x) => x.indexOf(and) >= 0) ||
              newArr.some((x) => x.indexOf(and) >= 0);
            if (!tf) {
              pushSnackMessage.push(and);
            }
            return tf;
          } else {
            const tf = and.or
              .map(
                (mod) =>
                  exemptedModules.some((x) => x.indexOf(mod) >= 0) ||
                  newArr.some((x) => x.indexOf(mod) >= 0)
              )
              .includes(true);
            if (!tf) {
              pushSnackMessage.push("(" + and.or.join(" or ") + ")");
            }
            return tf;
          }
        });
      }

      if (pushSnackMessage.join(" and ")) {
        pushSnack({
          message:
            "These prerequisites for " +
            moduleCode +
            " are not fulfilled: " +
            pushSnackMessage.join(" and "),
          severity: "error",
        });
        return true;
      }
      return false;
    },
    [modMap, pushSnack, exemptedModules]
  );

  const checkSemestersPreclusion = useCallback(
    (roadmap, module) => {
      const moduleCode = module[0] === "^" ? module.split("^")[3] : module;
      if (moduleCode === "" || !modMap.get(moduleCode).preclusion) return false;
      if (
        roadmap[roadmap.findIndex((sem) => sem.modules.includes(module))]
          .index === ROADMAP.MY_MODS_ID
      )
        return false;
      const preclusion = modMap
        .get(moduleCode)
        .preclusion.split(" ")
        .map((mod) => mod.replace(/[^a-zA-Z0-9 ]/g, ""))
        .filter((input) => /[a-zA-Z]+[0-9]/.test(input));
      const newArr = roadmap
        .reduce((a, b) => a.concat(b.modules), [])
        .map((mod) => (mod[0] === "^" ? mod.split("^")[3] : mod));

      if (!preclusion) return;

      if (newArr.some((x) => preclusion.includes(x) && x !== moduleCode)) {
        pushSnack({
          message:
            "The preclusion for " +
            moduleCode +
            " is already in the roadmap: " +
            newArr.find((x) => preclusion.includes(x) && x !== moduleCode),
          severity: "error",
        });
        return true;
      }
      return false;
    },
    [modMap, pushSnack]
  );

  const updateModuleGroup = useCallback(
    (arr, moduleCode) => {
      const prevId = "^" + arr[1] + "^" + arr[2] + "^" + arr[3];
      const newId = "^" + arr[1] + "^" + arr[2] + "^" + moduleCode;
      const newModules = JSON.parse(
        JSON.stringify(roadmap.find((sem) => sem.modules.includes(prevId)))
      );
      newModules.modules[newModules.modules.indexOf(prevId)] = newId;

      const newRoadmap = roadmap.map((sem) => {
        if (sem.modules.includes(prevId)) {
          return newModules;
        } else {
          return sem;
        }
      });

      if (checkSemestersPrereq(newRoadmap, newId)) {
        return false;
      }

      setRoadmap(newRoadmap);
      return true;
    },
    [roadmap, checkSemestersPrereq]
  );

  const dragMods = useCallback(
    (srcIndex, srcDroppableId, destIndex, destDroppableId) => {
      function generateModGroupId(name) {
        let temp = name;
        roadmap.map((sem) =>
          sem.modules.forEach((mod) => {
            if (mod.includes(temp)) {
              if (mod > name) name = mod;
            }
          })
        );
        return name === temp
          ? "^" + name + "^1^"
          : "^" + temp + "^" + (parseInt(name[name.length - 1]) + 1) + "^";
      }

      let srcDroppable;
      let destDroppable;

      switch (srcDroppableId) {
        case ROADMAP.COURSE_MODS_ID:
          srcDroppable = { modules: courseMods.map((mod) => mod.moduleCode) };
          break;
        case ROADMAP.COURSE_MOD_GROUPS_ID:
          srcDroppable = { modules: courseModGroups };
          break;
        default:
          srcDroppable = getSemesterById(srcDroppableId);
          break;
      }
      switch (destDroppableId) {
        case ROADMAP.COURSE_MODS_ID:
          destDroppable = { modules: [] }; // Dummy destination
          break;
        case ROADMAP.COURSE_MOD_GROUPS_ID:
          destDroppable = { modules: [] }; // Dummy destination
          break;
        default:
          destDroppable = getSemesterById(destDroppableId);
      }

      const [dragged] = srcDroppable.modules.splice(srcIndex, 1);
      destDroppable.modules.splice(
        destIndex,
        0,
        srcDroppableId === ROADMAP.COURSE_MOD_GROUPS_ID
          ? generateModGroupId(dragged.name)
          : dragged
      );

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
    [roadmap, getSemesterById, courseMods, courseModGroups]
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
    setBgColorById,
    dragSemesters,
    dragMods,
    updateModuleGroup,
    getAllMods,
    checkSemestersMC,
    checkSemestersPrereq,
    checkSemestersPreclusion,
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
