import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { NIL as NIL_UUID } from "uuid";
import LaunchIcon from "@mui/icons-material/Launch";
import { Course } from "../../models";
import { ResponsiveStack } from "../../components";
import { useCourse } from "../../providers";
import { ModuleStack } from "../../components/Mod";
import EditCourseButton from "./EditCourseButton";
import DeleteCourseButton from "./DeleteCourseButton";
import { ModGroupStack } from "../../components/ModGroup";

/**
 * Component to show detailed information
 * about the course.
 *
 * @returns A react component.
 */
export default function CourseDetail() {
  const { state } = useLocation();
  const {
    loading,
    getCourse,
    getCourseMods,
    getCourseModGroups,
    bindCourseMods,
    unbindCourseMods,
    bindCourseModGroups,
    unbindCourseModGroups,
  } = useCourse();

  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState({
    courseStatus: false,
    modsStatus: false,
    modGroupsStatus: false,
  });
  const [refreshMods, setRefreshMods] = useState(false);
  const [refreshModGroups, setRefreshModGroups] = useState(false);
  const [course, setCourse] = useState(new Course({ id: NIL_UUID }));
  const [mods, setMods] = useState([]);
  const [modGroups, setModGroups] = useState([]);

  useEffect(() => {
    let progressValue = 0;
    if (loaded.courseStatus) progressValue += 20;
    if (loaded.modsStatus) progressValue += 40;
    if (loaded.modGroupsStatus) progressValue += 40;
    setProgress(progressValue);
  }, [loaded]);

  useEffect(() => {
    async function loadCourse(courseId) {
      const data = getCourse(courseId) || new Course({ id: NIL_UUID });
      setCourse(data);

      setLoaded((loaded) => {
        const { courseStatus, ...others } = loaded;
        return { courseStatus: true, ...others };
      });
    }

    if (state?.courseId) {
      loadCourse(state.courseId);
      setRefreshMods(true);
      setRefreshModGroups(true);
    }
  }, [state, getCourse]);

  useEffect(() => {
    async function loadMods(courseId) {
      const data = await getCourseMods(courseId);
      setMods(data);
      setRefreshMods(false);

      setLoaded((loaded) => {
        const { modsStatus, ...others } = loaded;
        return { modsStatus: true, ...others };
      });
    }

    if (state?.courseId && refreshMods) {
      loadMods(state.courseId);
    }
  }, [state, refreshMods, getCourseMods]);

  useEffect(() => {
    async function loadModGroups(courseId) {
      const data = await getCourseModGroups(courseId);
      setModGroups(data);
      setRefreshModGroups(false);

      setLoaded((loaded) => {
        const { modGroupsStatus, ...others } = loaded;
        return { modGroupsStatus: true, ...others };
      });
    }

    if (state?.courseId && refreshModGroups) {
      loadModGroups(state.courseId);
    }
  }, [state, refreshModGroups, getCourseModGroups]);

  const handleAddMods = async (moduleCodes = []) => {
    const added = await bindCourseMods(course.id, {
      type: "Core",
      moduleCodes: moduleCodes,
    });
    setRefreshMods(true);
    return added;
  };

  const handleDeleteMod = async (moduleCode) => {
    const count = await unbindCourseMods(course.id, [moduleCode]);
    setRefreshMods(true);
    return count;
  };

  const handleBindModGroup = async (groupId) => {
    const added = await bindCourseModGroups(course.id, [groupId]);
    setRefreshModGroups(true);
    return added;
  };

  const handleUnbindModGroup = async (groupId) => {
    const count = await unbindCourseModGroups(course.id, [groupId]);
    setRefreshModGroups(true);
    return count;
  };

  return (
    <Stack spacing={2} sx={{ flex: 1 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">
          {loading ? <Skeleton width={120} /> : course.department}
        </Typography>
        <Stack direction="row" spacing={1}>
          <EditCourseButton variant="contained" course={course} />
          <DeleteCourseButton variant="outlined" course={course} />
        </Stack>
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Typography variant="h3" color="primary">
          {loading ? <Skeleton /> : course.title}
        </Typography>
        {course.url ? (
          <a
            href={course.url}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none" }}
          >
            <Button variant="outlined" endIcon={<LaunchIcon />}>
              Official page
            </Button>
          </a>
        ) : null}
      </Stack>
      <Box>
        <LinearProgress
          variant={loading ? "indeterminate" : "determinate"}
          value={progress}
          sx={{ borderRadius: 1 }}
        />
      </Box>
      <ResponsiveStack>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1">
            {loading ? (
              <Skeleton variant="rectangular" height={120} />
            ) : (
              course.description
            )}
          </Typography>
        </Box>
        <ModuleStack
          mods={mods}
          handleAddMods={handleAddMods}
          handleDeleteMod={handleDeleteMod}
          isCourse={true}
        />
        <ModGroupStack
          modGroups={modGroups}
          handleBindModGroup={handleBindModGroup}
          handleUnbindModGroup={handleUnbindModGroup}
          isCourse={true}
        />
      </ResponsiveStack>
      <Divider />
    </Stack>
  );
}
