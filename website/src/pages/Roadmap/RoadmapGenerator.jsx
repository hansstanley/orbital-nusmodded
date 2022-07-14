import {
  useBackend,
  useCourse,
  useSnackbar,
  useAuthSession,
} from "../../providers";
import { useEffect, useState } from "react";

export default function RoadmapGenerator() {
  const { getCourseMods, getCourseModGroups, getCourseId } = useCourse();
  const [mods, setMods] = useState([]);
  const [modGroups, setModGroups] = useState([]);

  useEffect(() => {
    async function loadMods(courseId) {
      if (courseId) {
        const data = await getCourseMods(courseId);
        setMods(data);
      }
    }

    loadMods(getCourseId());
  }, [getCourseMods, getCourseId]);

  useEffect(() => {
    async function loadModGroups(courseId) {
      const data = await getCourseModGroups(courseId);
      setModGroups(data);
    }
    loadModGroups(getCourseId());
  }, [getCourseModGroups, getCourseId]);

  return <>{console.log(mods + modGroups)}</>;
}
