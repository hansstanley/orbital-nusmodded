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
import { useState } from "react";
import * as React from 'react';
import { useCookies } from "react-cookie";
import { CourseInfoContext } from "../../contexts";

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
  const { courseList, isCoursesLoaded } = React.useContext(CourseInfoContext);
  const arrMCs = [...Array(39).keys()].map(x => x += 12);

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

  return (
    <Stack spacing={3} sx={{ display: "flex", flex: 1 }}>
      <Stack spacing={1}>
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
      </Stack>
      <Stack spacing={1}>
        <Typography variant="h6">Course</Typography>
        <FormControl fullWidth sx={{ width: 300 }}>
          <InputLabel>Course</InputLabel>
          <Select
            value={selectedCourse}
            label="Course"
            onChange={handleChangeCourse}
          >
            {courseList
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
