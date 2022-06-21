import { useState, useEffect } from "react";
import { Divider, Stack, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { NIL as NIL_UUID } from "uuid";
import { Course } from "../../models";
import { ResponsiveStack } from "../../components";
import { useCourse, useMod, useSnackbar } from "../../providers";
import { ModuleBox } from "../../components/Mod";

/**
 * Component to show detailed information
 * about the course.
 */
export default function CourseDetail() {
  const { state } = useLocation();
  const { getCourse, getCourseMods } = useCourse();
  const { getModInfo } = useMod();
  const { pushSnack } = useSnackbar();
  const [course, setCourse] = useState(new Course({ id: NIL_UUID }));
  const [mods, setMods] = useState([]);

  useEffect(() => {
    async function init(courseId) {
      let course = getCourse(courseId);
      setCourse(course);

      let mods = await getCourseMods(courseId);
      setMods(mods);
      mods = await Promise.all(mods.map((mod) => getModInfo(mod.moduleCode)));
      setMods(mods);
    }

    if (state?.courseId) init(state.courseId);
  }, [state, getCourse, getCourseMods, getModInfo]);

  return (
    <ResponsiveStack>
      <Stack spacing={2}>
        <Typography variant="h3" color="primary">
          {course.title}
        </Typography>
        <Typography variant="h6">{course.department}</Typography>
        <Divider />
        <Typography variant="body1">{course.description}</Typography>
      </Stack>
      <Stack spacing={1}>
        <Typography variant="h5">Modules</Typography>
        {mods.map((mod, index) => (
          <ModuleBox key={mod.moduleCode} mod={mod} />
        ))}
      </Stack>
    </ResponsiveStack>
  );
}
