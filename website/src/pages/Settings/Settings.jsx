import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { AuthGuard } from "../../components";
import { useCourse, useSettings, useSnackbar } from "../../providers";
import { SETTINGS } from "../../utils/constants";
import SettingsRow from "./SettingsRow";

const rowIds = {
  course: SETTINGS.COURSE.ID,
  maxMCs: SETTINGS.MC_LIMIT.ID,
  exemptedModules: SETTINGS.EXEMPTED_MODULES.ID,
};

export default function Settings() {
  const { loading: loadingCourses, getCourseArray } = useCourse();
  const { pushSnack } = useSnackbar();
  const { loading, getSetting, setCourseId, setMCLimit } = useSettings();
  const [init, setInit] = useState(true);
  const [loadingRow, setLoadingRow] = useState([]);
  const [successRow, setSuccessRow] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [maxMCs, setMaxMCs] = useState(23);
  const arrMCs = [...Array(39).keys()].map((x) => (x += 12));

  useEffect(() => {
    if (loading) {
      if (init) {
        setLoadingRow([SETTINGS.COURSE.ID, SETTINGS.MC_LIMIT.ID]);
        setInit(false);
      }
    } else {
      setSelectedCourse(getSetting(SETTINGS.COURSE.ID) || "");
      setMaxMCs(getSetting(SETTINGS.MC_LIMIT.ID) || 23);
      setLoadingRow([]);
    }
  }, [init, loading, getSetting]);

  const sortCourses = useCallback(() => {
    let courses = getCourseArray();
    return courses;
  }, [getCourseArray]);

  const handleChangeCourse = async (event) => {
    const newCourseId = event.target.value;

    setSelectedCourse(newCourseId);
    setSuccessRow(null);
    setLoadingRow((prev) => prev.concat([SETTINGS.COURSE.ID]));

    try {
      await setCourseId(newCourseId);
      setSuccessRow(rowIds.course);
    } catch (error) {
      console.error(error);
      pushSnack({
        message: error.message || "Unable to save course",
        severity: "error",
      });
    } finally {
      setLoadingRow((prev) => prev.filter((id) => id !== rowIds.course));
    }
  };

  const handleChangeMCs = async (event) => {
    const newMaxMCs = event.target.value;

    setMaxMCs(newMaxMCs);
    setSuccessRow(null);
    setLoadingRow((prev) => prev.concat([rowIds.maxMCs]));

    try {
      await setMCLimit(newMaxMCs);
      setSuccessRow(rowIds.maxMCs);
    } catch (error) {
      console.error(error);
      pushSnack({
        message: error.message || "Unable to save MC limit",
        severity: "error",
      });
    } finally {
      setLoadingRow((prev) => prev.filter((id) => id !== rowIds.maxMCs));
    }
  };

  const settingsRows = [
    {
      id: rowIds.course,
      title: "Course",
      content: (
        <FormControl disabled={loadingCourses}>
          <InputLabel>Select course</InputLabel>
          <Select
            value={selectedCourse}
            label="Select course"
            sx={{ minWidth: 240 }}
            onChange={handleChangeCourse}
          >
            {sortCourses().map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      id: rowIds.maxMCs,
      title: "Maximum MCs per semester",
      content: (
        <FormControl>
          <InputLabel>Select MC limit</InputLabel>
          <Select
            value={maxMCs}
            label="Select MC limit"
            sx={{ minWidth: 160 }}
            onChange={handleChangeMCs}
          >
            {arrMCs.map((num) => (
              <MenuItem key={num} value={num}>
                {num + " MCs"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
  ];

  return (
    <AuthGuard>
      <Stack spacing={2} flex={1}>
        {settingsRows.map((row) => (
          <SettingsRow
            key={row.id}
            title={row.title}
            loading={loadingRow.includes(row.id)}
            showSuccess={successRow === row.id}
          >
            {row.content}
          </SettingsRow>
        ))}
      </Stack>
    </AuthGuard>
  );
}
