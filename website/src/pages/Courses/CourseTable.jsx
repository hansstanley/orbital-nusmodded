import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCourse, useSnackbar } from "../../providers";
import { columns } from "./constants";

export default function CourseTable() {
  const navigate = useNavigate();
  const { loading, getCourseArray } = useCourse();
  const { pushSnack } = useSnackbar();

  const handleExplore = (courseId) => () => {
    navigate("/courses/detail", { state: { courseId } });
  };

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.id} align={col.align}>
                {col.label}
              </TableCell>
            ))}
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {getCourseArray().map((course) => (
            <TableRow key={course.id}>
              {columns.map((col) => (
                <TableCell key={col.id} align={col.align}>
                  {course[col.id]}
                </TableCell>
              ))}
              <TableCell align="right">
                <Button onClick={handleExplore(course.id)}>Explore</Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell align="center" colSpan={4} variant="footer">
              {loading ? <CircularProgress /> : "No more courses."}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
