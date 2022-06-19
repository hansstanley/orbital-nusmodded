import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useCourse, useSnackbar } from "../../providers";
import { columns } from "./constants";

export default function CourseTable() {
  const { getCourseArray } = useCourse();
  const { pushSnack } = useSnackbar();

  const handleExplore = () => {
    pushSnack({
      message: `This button navigates to CourseDetail`,
      severity: "warning",
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell align={col.align}>{col.label}</TableCell>
            ))}
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {getCourseArray().map((course) => (
            <TableRow key={course.id}>
              {columns.map((col) => (
                <TableCell align={col.align}>{course[col.id]}</TableCell>
              ))}
              <TableCell align="right">
                <Button onClick={handleExplore}>Explore</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
