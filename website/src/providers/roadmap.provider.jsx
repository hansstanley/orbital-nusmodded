import { useCallback, useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { v4, validate as uuidValidate, version as uuidVersion } from "uuid";
import { ROADMAP, SEMESTER_TITLE, SETTINGS } from "../utils/constants";
import { useAuthSession } from "./auth-session.provider";
import { useBackend } from "./backend.provider";
import { useSnackbar } from "./snackbar.provider";
import { useCourse } from "./course.provider";
import { useMod } from "./mod.provider";
import { useSettings } from "./settings.provider";
import { useModGroup } from ".";

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
  getIssues: async () => [],
});

function RoadmapProvider({ children }) {
  const { isAuth } = useAuthSession();
  const { makeRequest } = useBackend();
  const { pushSnack } = useSnackbar();
  const { getCourseMods, getCourseModGroups } = useCourse();
  const { getModInfo } = useMod();
  const { isModGroupString, getModGroupString, parseModGroupString } =
    useModGroup();
  const { loading: loadingSettings, getSetting } = useSettings();
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState([]);
  const [MCLimit, setMCLimit] = useState(0);
  const [exemptedModules, setExemptedModules] = useState([]);
  const [courseMods, setCourseMods] = useState([]);
  const [courseModGroups, setCourseModGroups] = useState([]);

  useEffect(() => {
    function maintainRoadmap(roadmap) {
      const newRoadmap = Array.isArray(roadmap) ? [...roadmap] : [];

      const isEmpty = newRoadmap.length === 0;
      const missingMyMods =
        newRoadmap.findIndex((sem) => sem?.id === ROADMAP.MY_MODS_ID) === -1;
      const missingMyModGroups =
        newRoadmap.findIndex((sem) => sem?.id === ROADMAP.MY_MOD_GROUPS_ID) ===
        -1;
      const missingExemptedMods =
        newRoadmap.findIndex((sem) => sem?.id === ROADMAP.EXEMPTED_MODS_ID) ===
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
      if (missingExemptedMods) {
        newRoadmap.push({ id: ROADMAP.EXEMPTED_MODS_ID, modules: [] });
      }

      setRoadmap(newRoadmap);
    }

    function init() {
      if (loadingSettings) {
        setLoading(true);
      } else {
        const loadedRoadmap = getSetting(SETTINGS.ROADMAP.ID);
        const loadedMCLimit = getSetting(SETTINGS.MC_LIMIT.ID);
        const loadedExempted = getSetting(SETTINGS.EXEMPTED_MODULES.ID);
        maintainRoadmap(loadedRoadmap);
        setMCLimit(loadedMCLimit);
        setExemptedModules(loadedExempted);
        setLoading(false);
      }
    }

    if (isAuth()) {
      init();
    } else {
      setRoadmap([]);
    }
  }, [isAuth, loadingSettings, getSetting]);

  useEffect(() => {
    async function saveRoadmap() {
      try {
        const { status } = await makeRequest({
          method: "post",
          route: "/user-settings/edit",
          data: {
            key: SETTINGS.ROADMAP.ID,
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

    if (isAuth() && Array.isArray(roadmap) && roadmap.length) {
      saveRoadmap();
    }
  }, [isAuth, roadmap, makeRequest, pushSnack]);

  useEffect(() => {
    async function loadData() {
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

    if (!loadingSettings) loadData();
  }, [loadingSettings, getSetting, getCourseMods, getCourseModGroups]);

  const getAllMods = useCallback(
    () =>
      roadmap
        .reduce((prev, currSem) => prev.concat(currSem?.modules || []), [])
        .map((mod) => parseModGroupString(mod)?.moduleCode || mod),
    [roadmap, parseModGroupString]
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
    async (roadmap = []) => {
      const hasExceeds = await Promise.all(
        roadmap
          .map(toModuleCodes)
          .map(toModuleCredits)
          .map(toTotalCredit)
          .map(toExceedLimit)
      );

      const issues = [];
      hasExceeds.forEach((exceeds, index) => {
        if (exceeds)
          issues.push({
            severity: "warning",
            message: `${getSemesterName(
              roadmap[index]
            )} exceeds the MC limit of ${MCLimit}.`,
          });
      });
      return issues;

      function toModuleCodes(sem) {
        return (
          sem?.modules?.map((mod) =>
            isModGroupString(mod) ? parseModGroupString(mod)?.moduleCode : mod
          ) || []
        );
      }
      function toModuleCredits(moduleCodes) {
        return (
          moduleCodes?.map(async (mod) =>
            mod ? (await getModInfo(mod)).moduleCredit : 0
          ) || []
        );
      }
      async function toTotalCredit(moduleCredits) {
        const credits = await Promise.all(moduleCredits);
        return credits.reduce((sum, credit) => sum + parseInt(credit), 0);
      }
      async function toExceedLimit(totalCredit) {
        return (await totalCredit) > MCLimit;
      }

      function getSemesterName(sem) {
        if (!sem) {
          return "Unknown semester";
        } else {
          return `Year ${sem?.year} ${
            SEMESTER_TITLE[sem?.semester || -1] || "Semester ?"
          }`;
        }
      }
    },
    [MCLimit, getModInfo, isModGroupString, parseModGroupString]
  );

  const checkSemestersPrereq = useCallback(
    async (roadmap = []) => {
      let issues = [];

      const exemptedMods =
        getSemesterById(ROADMAP.EXEMPTED_MODS_ID)?.modules || [];
      let modsBefore = [];
      for (let sem of roadmap) {
        const mods = sem?.modules || [];
        const moduleCodes = mods.map((mod) =>
          isModGroupString(mod) ? parseModGroupString(mod)?.moduleCode : mod
        );
        const modInfos = await Promise.all(
          moduleCodes.map((code) => getModInfo(code))
        );
        const prereqs = modInfos.map((info) => info.prereqTree);

        let index = -1;
        for (let prereq of prereqs) {
          index += 1;
          if (!prereq) continue;

          const tempIssues = processPrereq(prereq, modsBefore, exemptedMods);
          if (tempIssues) {
            issues.push(
              `The module ${moduleCodes[index]} has the prerequisite(s): ${tempIssues}`
            );
          }
        }

        modsBefore = modsBefore.concat(moduleCodes);
        for (let info of modInfos) {
          if (Array.isArray(info?.preclusion)) {
            modsBefore = modsBefore.concat(info.preclusion);
          }
        }
      }

      return issues;

      function processPrereq(
        prereq,
        modsBefore = [],
        exemptedMods = [],
        isFirstLevel = true
      ) {
        if (typeof prereq === "string") {
          return modsBefore.includes(prereq) || exemptedMods.includes(prereq)
            ? false
            : prereq;
        }

        let missing = [];
        const prereqAnd = prereq.and;
        const prereqOr = prereq.or;

        if (Array.isArray(prereqAnd)) {
          const missingAnd = prereqAnd
            .map((mod) => processPrereq(mod, modsBefore, exemptedMods, false))
            .filter((mod) => !!mod);
          return missingAnd.length
            ? `${isFirstLevel ? "" : "all of ("}${missingAnd.join(", ")}${
                isFirstLevel ? "" : ")"
              }`
            : false;
        } else if (Array.isArray(prereqOr)) {
          const missingOr = prereqOr.map((mod) =>
            processPrereq(mod, modsBefore, exemptedMods, false)
          );

          let tempMissing = [];
          for (let mod of missingOr) {
            if (mod) {
              tempMissing.push(mod);
            } else {
              tempMissing = [];
              break;
            }
          }

          if (tempMissing.length) {
            return `one of (${tempMissing.join(", ")})`;
          } else {
            return false;
          }
        }

        return missing.length ? missing : false;
      }
    },
    [getModInfo, getSemesterById, isModGroupString, parseModGroupString]
  );

  const checkSemestersPreclusion = useCallback(
    async (roadmap = []) => {
      let issues = [];

      for (let sem of roadmap) {
        const mods = sem?.modules || [];
        const moduleCodes = mods.map((mod) =>
          isModGroupString(mod) ? parseModGroupString(mod)?.moduleCode : mod
        );
        let modInfos = await Promise.all(
          moduleCodes.map((code) => getModInfo(code))
        );

        while (modInfos.length) {
          const { precludedMods, otherMods } = modInfos.slice(1).reduce(
            (prev, curr) => {
              if (prev.preclusion.includes(curr.moduleCode)) {
                prev.precludedMods.push(curr);
              } else {
                prev.otherMods.push(curr);
              }
              return prev;
            },
            {
              precludedMods: [modInfos[0]],
              otherMods: [],
              preclusion: modInfos[0]?.preclusion || [],
            }
          );

          if (precludedMods.length > 1) {
            issues.push({
              severity: "error",
              message: `${precludedMods
                .map((mod) => mod.moduleCode)
                .join(", ")} are preclusions.`,
            });
          }
          modInfos = otherMods;
        }
      }

      return issues;
    },
    [getModInfo, isModGroupString, parseModGroupString]
  );

  const checkSemestersAvailability = useCallback(
    async (roadmap = []) => {
      let issues = [];

      for (let sem of roadmap) {
        if (!sem) continue;
        if (!Object.keys(SEMESTER_TITLE).includes(`${sem.semester}`)) continue;

        const semester = sem.semester;

        const mods = sem.modules || [];
        const moduleCodes = mods.map((mod) =>
          isModGroupString(mod) ? parseModGroupString(mod)?.moduleCode : mod
        );
        const modInfos = await Promise.all(
          moduleCodes.map((code) => getModInfo(code))
        );

        for (let info of modInfos) {
          if (!info || !Array.isArray(info.semesterData)) continue;
          const isAvailable = info.semesterData.reduce(
            (prev, curr) => prev || curr.semester === semester,
            false
          );
          if (!isAvailable) {
            issues.push({
              severity: "error",
              message: `${info.moduleCode} is not offered in ${SEMESTER_TITLE[semester]}.`,
            });
          }
        }
      }

      return issues;
    },
    [getModInfo, isModGroupString, parseModGroupString]
  );

  const updateModuleGroup = useCallback(
    ({ name, count, moduleCode }, newModuleCode) => {
      if (!Array.isArray(roadmap)) return null;

      const prevId = getModGroupString(name, count, moduleCode);
      const newId = getModGroupString(name, count, newModuleCode);
      const targetSemester = roadmap.find(
        (sem) => sem?.modules?.includes(prevId) ?? false
      );
      if (!targetSemester) return null;

      targetSemester.modules[targetSemester.modules.indexOf(prevId)] = newId;
      const newRoadmap = roadmap.map((sem) =>
        sem?.modules?.includes(prevId) ? targetSemester : sem
      );

      setRoadmap(newRoadmap);
      return newId;
    },
    [roadmap, getModGroupString]
  );

  const getIssues = useCallback(async () => {
    const roadmap = getSemesters();

    let issues = [];
    issues = issues
      .concat(await checkSemestersMC(roadmap))
      .concat(await checkSemestersPrereq(roadmap))
      .concat(await checkSemestersPreclusion(roadmap))
      .concat(await checkSemestersAvailability(roadmap));

    return issues;
  }, [
    getSemesters,
    checkSemestersMC,
    checkSemestersPrereq,
    checkSemestersPreclusion,
    checkSemestersAvailability,
  ]);

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
          ? getModGroupString(name, 1)
          : getModGroupString(temp, parseModGroupString(name).count + 1);
      }

      let srcDroppable;
      let destDroppable;

      switch (srcDroppableId) {
        case ROADMAP.COURSE_MODS_ID:
          srcDroppable = {
            modules: courseMods
              .filter(({ moduleCode }) => !getAllMods().includes(moduleCode))
              .map(({ moduleCode }) => moduleCode),
          };
          break;
        case ROADMAP.COURSE_MOD_GROUPS_ID:
          srcDroppable = {
            modules: JSON.parse(JSON.stringify(courseModGroups)),
          };
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
    [
      roadmap,
      getAllMods,
      getSemesterById,
      courseMods,
      courseModGroups,
      getModGroupString,
      parseModGroupString,
    ]
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
    getIssues,
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
