import {
  Button,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCourse } from "../../providers";
import { columns } from "./constants";
import EditCourseButton from "./EditCourseButton";

export default function CourseTable({ sortBy = "", searchBy = "" }) {
  const navigate = useNavigate();
  const { loading, getCourseArray } = useCourse();

  const handleExplore = (courseId) => () => {
    navigate("/courses/detail", { state: { courseId } });
  };

  const sortCourses = useCallback(() => {
    let courses = getCourseArray();

    if (searchBy) {
      courses = courses.filter(
        (course) =>
          course.title?.toLowerCase().includes(searchBy) ||
          course.department?.toLowerCase().includes(searchBy) ||
          course.description?.toLowerCase().includes(searchBy) ||
          false
      );
    }

    switch (sortBy) {
      case "department":
        courses.sort((c1, c2) => c1.department.localeCompare(c2.department));
        break;
      case "title":
      default:
        courses.sort((c1, c2) => c1.title.localeCompare(c2.title));
        break;
    }

    return courses;
  }, [sortBy, searchBy, getCourseArray]);

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
            <TableCell align="center" />
          </TableRow>
        </TableHead>
        <TableBody>
          {sortCourses().map((course) => (
            <TableRow key={course.id}>
              {columns.map((col) => (
                <TableCell key={col.id} align={col.align}>
                  {course[col.id]}
                </TableCell>
              ))}
              <TableCell align="center">
                <Button onClick={handleExplore(course.id)}>Explore</Button>
                <EditCourseButton course={course} />
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell align="center" colSpan={4} variant="footer">
              {loading ? "Loading..." : "No more courses."}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {loading ? (
        <LinearProgress />
      ) : (
        <LinearProgress variant="determinate" value={100} />
      )}
    </TableContainer>
  );
}
