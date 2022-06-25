import { 
  Card, 
  Slider, 
  Stack, 
  Typography,
  FormControl,
  InputLabel,
  Select, 
  MenuItem,
  Box,
} from "@mui/material";
import * as React from 'react';
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { CourseInfoContext } from "../../contexts";
import { useCourse } from "../../providers";
import { useBackend } from "../../providers";
import { useSnackbar } from "../../providers";

const minYearWidth = 1;
const [minYear, maxYear] = [1, 6];
const yearMarks = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
];

export default function Settings() {
  const [cookies, setCookies] = useCookies(["yearWidth"]);
  const [yearWidth, setYearWidth] = useState(cookies.yearWidth ?? [1, 4]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [maxMCs, setMaxMCs] = useState("20");
  const { getCourseArray } = useCourse();
  // const { courseList, isCoursesLoaded } = React.useContext([]);
  const arrMCs = [...Array(39).keys()].map(x => x += 12);

  getCourseArray().map(course => course.title)

  const sortCourses = React.useCallback(() => {
    let courses = getCourseArray();

    return courses;
  }, [getCourseArray]);

  const handleChangeCourse = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleChangeMCs = (event) => {
    setMaxMCs(event.target.value);
  };

  const handleYearWidthChange = (event, newYearWidth, activeThumb) => {
    if (!Array.isArray(newYearWidth)) return;

    if (newYearWidth[1] - newYearWidth[0] < minYearWidth) {
      if (activeThumb === minYear) {
        const clamped = Math.min(newYearWidth[0], maxYear - minYearWidth);
        setYearWidth([clamped, clamped + minYearWidth]);
      } else {
        const clamped = Math.max(newYearWidth[1], minYearWidth);
        setYearWidth([clamped - minYearWidth, clamped]);
      }
    } else {
      setYearWidth(newYearWidth);
    }

    setCookies("yearWidth", yearWidth, { path: "/" });
  };

  const { makeRequest } = useBackend();
  const { pushSnack } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [allMods, setAllMods] = useState([]);

/*  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const { status, data } = await makeRequest({
          method: "get",
          route: "/user-settings",
          isPublic: false,
        });

        if (status === 200 && data?.COURSE) {
          setSelectedCourse(data.COURSE || "");
        } else {
          setSelectedCourse("");
        }
      } catch (error) {
        console.error(error);
        pushSnack({
          message: "Unable to retrieve course",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [makeRequest, pushSnack]);

  useEffect(() => {
    async function saveCourse() {
      try {
        const { status } = await makeRequest({
          method: "post",
          route: "/user-settings/edit",
          data: {
            key: "COURSE",
            value: selectedCourse,
          },
          isPublic: false,
        });

        if (status !== 200) {
          throw new Error("Unable to save course");
        }
      } catch (error) {
        console.error(error);
        pushSnack({
          message: error.message || "Unable to save course",
          severity: "error",
        });
      }
    }

    saveCourse();
  }, [selectedCourse, makeRequest, pushSnack]);*/

  return (
    <Stack spacing={3} sx={{ display: "flex", flex: 1 }}>
      {/* <Stack spacing={1}>
        <Typography variant="h6">Year of study</Typography>
        <Card sx={{ p: 2, pl: 5 }}>
          <Slider
            value={yearWidth}
            step={1}
            min={minYear}
            max={maxYear}
            onChange={handleYearWidthChange}
            sx={{ width: "50%" }}
            valueLabelDisplay="off"
            marks={yearMarks}
            disableSwap
          />
        </Card>
      </Stack> */}
      <Stack spacing={1}>
        <Typography variant="h6">Course</Typography>
        <FormControl fullWidth sx={{ width: 300 }}>
          <InputLabel>Course</InputLabel>
          <Select
            value={selectedCourse}
            label="Course"
            onChange={handleChangeCourse}
          >
            {sortCourses()
            .map( course => 
              <MenuItem value = {course.title}>{course.title}</MenuItem>
            )}
          </Select>
        </FormControl>
      </Stack>
      <Stack spacing={1} >
        <Typography variant="h6">Max MCs per Semester</Typography>
        <FormControl sx={{ width: 120 }}>
          <InputLabel>Max MCs</InputLabel>
          <Select
            value={maxMCs}
            label="Max MCs"
            onChange={handleChangeMCs}
            MenuProps={{ PaperProps: { sx: { maxHeight: 500 } } }}
          >
            {arrMCs
            .map( num => 
              <MenuItem value = {num}>{num + " MCs"}</MenuItem>
            )}
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  );
}
