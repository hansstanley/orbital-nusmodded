import { useState, useEffect } from "react";
import { Divider, LinearProgress, Stack, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { NIL as NIL_UUID } from "uuid";
import { Course } from "../../models";
import { ResponsiveStack } from "../../components";
import { useCourse, useSnackbar } from "../../providers";
import { ModuleBox } from "../../components/Mod";
import { Box } from "@mui/system";
import EditCourseButton from "./EditCourseButton";

/**
 * Component to show detailed information
 * about the course.
 */
export default function CourseDetail() {
  const { state } = useLocation();
  const { loading, getCourse, getCourseMods } = useCourse();
  const { pushSnack } = useSnackbar();
  const [progress, setProgress] = useState(0);
  const [course, setCourse] = useState(new Course({ id: NIL_UUID }));
  const [mods, setMods] = useState([]);

  useEffect(() => {
    async function loadCourse(courseId) {
      const data = getCourse(courseId) || new Course({ id: NIL_UUID });
      setCourse(data);
      setProgress(30);
    }

    async function loadMods(courseId) {
      const data = await getCourseMods(courseId);
      setMods(data);
      setProgress(100);
    }

    if (state?.courseId) {
      setProgress(0);
      loadCourse(state.courseId);
      loadMods(state.courseId);
    }
  }, [state, getCourse, getCourseMods]);

  return (
    <Stack spacing={2} sx={{ flex: 1 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">{course.department}</Typography>
        <EditCourseButton variant="contained" course={course} />
      </Stack>
      <Typography variant="h3" color="primary">
        {course.title}
      </Typography>
      <Box>
        <LinearProgress
          variant={loading ? "indeterminate" : "determinate"}
          value={progress}
        />
      </Box>
      <ResponsiveStack>
        <Box>
          <Typography variant="body1">{course.description}</Typography>
        </Box>
        <Stack spacing={1}>
          <Typography variant="h5">Modules</Typography>
          <Divider />
          {mods.length ? (
            mods.map((mod) => (
              <ModuleBox key={mod.moduleCode} moduleCode={mod.moduleCode} />
            ))
          ) : (
            <Typography variant="body2">No modules.</Typography>
          )}
        </Stack>
      </ResponsiveStack>
      <Divider />
    </Stack>
  );
}
