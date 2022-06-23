import { useState, useEffect } from "react";
import {
  ButtonGroup,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { NIL as NIL_UUID } from "uuid";
import { Box } from "@mui/system";
import { Course } from "../../models";
import { ResponsiveStack } from "../../components";
import { useCourse, useSnackbar } from "../../providers";
import { ModuleStack } from "../../components/Mod";
import EditCourseButton from "./EditCourseButton";
import DeleteCourseButton from "./DeleteCourseButton";

/**
 * Component to show detailed information
 * about the course.
 */
export default function CourseDetail() {
  const { state } = useLocation();
  const {
    loading,
    getCourse,
    getCourseMods,
    bindCourseMods,
    unbindCourseMods,
  } = useCourse();
  const { pushSnack } = useSnackbar();
  const [progress, setProgress] = useState(0);
  const [refreshMods, setRefreshMods] = useState(false);
  const [course, setCourse] = useState(new Course({ id: NIL_UUID }));
  const [mods, setMods] = useState([]);

  useEffect(() => {
    async function loadCourse(courseId) {
      const data = getCourse(courseId) || new Course({ id: NIL_UUID });
      setCourse(data);
      setProgress(30);
    }

    if (state?.courseId) {
      setProgress(0);
      loadCourse(state.courseId);
      setRefreshMods(true);
    }
  }, [state, getCourse, getCourseMods]);

  useEffect(() => {
    async function loadMods(courseId) {
      setProgress(30);
      const data = await getCourseMods(courseId);
      setMods(data);
      setProgress(100);
      setRefreshMods(false);
    }

    if (state?.courseId && refreshMods) {
      loadMods(state.courseId);
    }
  }, [state, refreshMods, getCourseMods]);

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

  return (
    <Stack spacing={2} sx={{ flex: 1 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">{course.department}</Typography>
        <Stack direction="row" spacing={1}>
          <EditCourseButton variant="contained" course={course} />
          <DeleteCourseButton variant="outlined" course={course} />
        </Stack>
      </Stack>
      <Typography variant="h3" color="primary">
        {course.title}
      </Typography>
      <Box>
        <LinearProgress
          variant={loading ? "indeterminate" : "determinate"}
          value={progress}
          sx={{ borderRadius: 1 }}
        />
      </Box>
      <ResponsiveStack>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1">{course.description}</Typography>
        </Box>
        <ModuleStack
          mods={mods}
          handleAddMods={handleAddMods}
          handleDeleteMod={handleDeleteMod}
        />
      </ResponsiveStack>
      <Divider />
    </Stack>
  );
}
