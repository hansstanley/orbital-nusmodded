import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { AuthGuard } from "../../components";
import { ModuleStack } from "../../components/Mod";
import {
  useAuthSession,
  useBackend,
  useCourse,
  useSettings,
  useSnackbar,
} from "../../providers";
import { SETTINGS } from "../../utils/constants";
import SettingsRow from "./SettingsRow";

const rowIds = {
  course: SETTINGS.COURSE.ID,
  maxMCs: SETTINGS.MC_LIMIT.ID,
  exemptedModules: SETTINGS.EXEMPTED_MODULES.ID,
};

export default function Settings() {
  const { isAuth } = useAuthSession();
  const { makeRequest } = useBackend();
  const { loading: loadingCourses, getCourseArray } = useCourse();
  const { pushSnack } = useSnackbar();
  const { loading, getSetting, setCourseId, setMCLimit, setExemptedModules } = useSettings();
  const [loadingRow, setLoadingRow] = useState([]);
  const [successRow, setSuccessRow] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [maxMCs, setMaxMCs] = useState(23);
  const [exemptedMods, setExemptedMods] = useState([]);
  const arrMCs = [...Array(39).keys()].map((x) => (x += 12));

  useEffect(() => {
    if (loading) {
      setLoadingRow([SETTINGS.COURSE.ID, SETTINGS.MC_LIMIT.ID]);
    } else {
      setSelectedCourse(getSetting(SETTINGS.COURSE.ID) || "");
      setMaxMCs(getSetting(SETTINGS.MC_LIMIT.ID) || 23);
      setExemptedMods(getSetting(SETTINGS.EXEMPTED_MODULES) || []);
      setLoadingRow([]);
    }
  }, [loading, getSetting]);

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

  const handleAddExemptedModules = async (moduleCodes = []) => {
    const newCodes = moduleCodes.filter((code) => !exemptedMods.includes(code));

    const holdingCodes = newCodes.concat(exemptedMods?.modules || []);

    setSuccessRow(null);
    setLoadingRow((prev) => prev.concat([rowIds.exemptedModules]));

    try {
      await setExemptedModules(holdingCodes);
    } catch (error) {
      console.error(error);
      pushSnack({
        message: error.message || "Unable to save exempted modules",
        severity: "error",
      });
    } finally {
      setLoadingRow((prev) => prev.filter((id) => id !== rowIds.exemptedModules));
    }
    return newCodes;
  };

  const handleDeleteExemptedModules = async (moduleCode) => {
    const holdingCodes = exemptedMods?.modules?.filter((code) => code !== moduleCode) || [];

    setSuccessRow(null);
    setLoadingRow((prev) => prev.concat([rowIds.exemptedModules]));

    try {
      await setExemptedModules(holdingCodes);
    } catch (error) {
      console.error(error);
      pushSnack({
        message: error.message || "Unable to save exempted modules",
        severity: "error",
      });
    } finally {
      setLoadingRow((prev) => prev.filter((id) => id !== rowIds.exemptedModules));
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
