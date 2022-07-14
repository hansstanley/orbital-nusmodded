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
  const [loadingRow, setLoadingRow] = useState([]);
  const [successRow, setSuccessRow] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [maxMCs, setMaxMCs] = useState(23);
  const [exemptedModules, setExemptedModules] = useState([]);
  const arrMCs = [...Array(39).keys()].map((x) => (x += 12));

  useEffect(() => {
    async function init() {
      setLoadingRow([...Object.values(rowIds)]);
      try {
        const { status, data } = await makeRequest({
          method: "get",
          route: "/user-settings",
          isPublic: false,
        });

        if (status === 200 && data) {
          setSelectedCourse(data[rowIds.course] || "");
          setMaxMCs(data[rowIds.maxMCs || 23]);
          setExemptedModules(data[rowIds.exemptedModules] || []);
          // console.log(data);
        } else {
          throw new Error("Unable to retrieve user settings");
        }
      } catch (error) {
        console.error(error);
        pushSnack({
          message: error.message || "Unable to retrieve user settings",
          severity: "error",
        });
      } finally {
        setLoadingRow([]);
      }
    }

    if (isAuth()) init();
  }, [isAuth, makeRequest, pushSnack]);

  const sortCourses = useCallback(() => {
    let courses = getCourseArray();

    return courses;
  }, [getCourseArray]);

  const handleChangeCourse = async (event) => {
    setSelectedCourse(event.target.value);
    setSuccessRow(null);
    setLoadingRow((prev) => prev.concat([rowIds.course]));

    try {
      const { status } = await makeRequest({
        method: "post",
        route: "/user-settings/edit",
        data: { key: rowIds.course, value: event.target.value },
        isPublic: false,
      });

      if (status === 200) {
        setSuccessRow(rowIds.course);
      } else {
        throw new Error(`Unable to save course`);
      }
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
    setMaxMCs(event.target.value);
    setSuccessRow(null);
    setLoadingRow((prev) => prev.concat([rowIds.maxMCs]));

    try {
      const { status } = await makeRequest({
        method: "post",
        route: "/user-settings/edit",
        data: { key: rowIds.maxMCs, value: event.target.value },
        isPublic: false,
      });

      if (status === 200) {
        setSuccessRow(rowIds.maxMCs);
      } else {
        throw new Error("Unable to save MC limit");
      }
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
    const newCodes = moduleCodes.filter((code) => !exemptedModules.includes(code));

    const holdingCodes = newCodes.concat(exemptedModules?.modules || []);

    setSuccessRow(null);
    setLoadingRow((prev) => prev.concat([rowIds.exemptedModules]));

    try {
      const { status } = await makeRequest({
        method: "post",
        route: "/user-settings/edit",
        data: { key: rowIds.exemptedModules, value: holdingCodes },
        isPublic: false,
      });

      if (status === 200) {
        setExemptedModules(holdingCodes);
      } else {
        throw new Error("Unable to save exempted modules");
      }
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
    const holdingCodes = exemptedModules?.modules?.filter((code) => code !== moduleCode) || [];

    setSuccessRow(null);
    setLoadingRow((prev) => prev.concat([rowIds.exemptedModules]));

    try {
      const { status } = await makeRequest({
        method: "post",
        route: "/user-settings/edit",
        data: { key: rowIds.exemptedModules, value: holdingCodes },
        isPublic: false,
      });

      if (status === 200) {
        setExemptedModules(holdingCodes);
      } else {
        throw new Error("Unable to save exempted modules");
      }
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
    {
      id: rowIds.exemptedModules,
      title: "Exempted Modules",
      content: (
        <ModuleStack 
          mods={exemptedModules}
          isDroppable={false}
          handleAddMods={handleAddExemptedModules}
          handleDeleteMod={handleDeleteExemptedModules}
        />
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
