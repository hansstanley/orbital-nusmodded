import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { AuthGuard } from "../../components";
import {
  useAuthSession,
  useBackend,
  useCourse,
  useSnackbar,
} from "../../providers";
import SettingsRow from "./SettingsRow";

// const minYearWidth = 1;
// const [minYear, maxYear] = [1, 6];
// const yearMarks = [
//   { value: 1, label: "1" },
//   { value: 2, label: "2" },
//   { value: 3, label: "3" },
//   { value: 4, label: "4" },
//   { value: 5, label: "5" },
//   { value: 6, label: "6" },
// ];
const rowIds = {
  course: "COURSE_ID",
  maxMCs: "MC_LIMIT",
};

export default function Settings() {
  const { isAuth } = useAuthSession();
  const { makeRequest } = useBackend();
  const { loading: loadingCourses, getCourseArray } = useCourse();
  const { pushSnack } = useSnackbar();
  const [loadingRow, setLoadingRow] = useState([]);
  const [successRow, setSuccessRow] = useState(null);
  // const [allMods, setAllMods] = useState([]);
  // const [cookies, setCookies] = useCookies(["yearWidth"]);
  // const [yearWidth, setYearWidth] = useState(cookies.yearWidth ?? [1, 4]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [maxMCs, setMaxMCs] = useState(23);
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

  const sortCourses = React.useCallback(() => {
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

  // const handleYearWidthChange = (event, newYearWidth, activeThumb) => {
  //   if (!Array.isArray(newYearWidth)) return;

  //   if (newYearWidth[1] - newYearWidth[0] < minYearWidth) {
  //     if (activeThumb === minYear) {
  //       const clamped = Math.min(newYearWidth[0], maxYear - minYearWidth);
  //       setYearWidth([clamped, clamped + minYearWidth]);
  //     } else {
  //       const clamped = Math.max(newYearWidth[1], minYearWidth);
  //       setYearWidth([clamped - minYearWidth, clamped]);
  //     }
  //   } else {
  //     setYearWidth(newYearWidth);
  //   }

  //   setCookies("yearWidth", yearWidth, { path: "/" });
  // };

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
