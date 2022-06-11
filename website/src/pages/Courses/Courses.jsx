import * as React from 'react';
import {
  Box,
  InputLabel,
  Stack,
  MenuItem,
  FormControl,
  Select,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ModuleInfoContext } from "../../contexts";
import EditCourse from "./EditCourse";
import AddCourse from "./AddCourse";

export default function ModuleInfo() {
  const [selectedCourse, setSelectedCourse] = React.useState("");
  const { modules, isLoaded } = React.useContext(ModuleInfoContext);
  const [courses, setCourses] = React.useState([{name: "Computer Science", modules: ["CS1101S", "CS1231S"]}]);
  const [totalMCs, setTotalMCs] = React.useState(0);

  const handleChange = (event) => {
    setSelectedCourse(event.target.value);
    updateMCs(event.target.value);
  };

  const updateMCs = (selectedCourse) => {
    setTotalMCs(courses.find(course => course.name === selectedCourse).modules
      .map((modName) => modules.find(mod => mod.moduleCode === modName))
      .reduce((prev, curr) => prev + parseInt(curr.moduleCredit), 0));
  }

  return (
    <Stack spacing={2} minWidth = "100%">
      <Stack direction = "row" justifyContent="space-between">
        <Stack direction = "row" spacing = {2}>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel>Course</InputLabel>
              <Select
                value={selectedCourse}
                label="Course"
                onChange={handleChange}
              >
                {courses
                .map( course => 
                  <MenuItem value = {course.name}>{course.name}</MenuItem>

                )}
              </Select>
            </FormControl>
          </Box>
          <Typography variant="h5" position = "relative" top = "17%">Total MCs : {totalMCs}</Typography>
        </Stack>
        <Stack direction = "row" spacing = {2}>
          <AddCourse courses = {courses} setCourses = {setCourses}></AddCourse>
          <EditCourse 
            course = {courses.find(course => course.name === selectedCourse)}
            courses = {courses}
            setCourses = {setCourses}
            updateMCs = {updateMCs}
            />
        </Stack>
      </Stack>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell align="center" width = {10}>MCs</TableCell>
              <TableCell align="center" width = {200}>Module Code</TableCell>
              <TableCell align="center">Module Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoaded && selectedCourse !== ""? (
              courses.find(course => course.name === selectedCourse).modules
              .map((modName) => modules.find(mod => mod.moduleCode === modName))
              .map((mod) => (
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center">{mod.moduleCredit}</TableCell>
                <TableCell align="center">{mod.moduleCode}</TableCell>
                <TableCell align="center">{mod.title}</TableCell>
              </TableRow>
            ))) : (
              <TableRow />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
