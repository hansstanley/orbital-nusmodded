import { Button } from "@mui/material";
import { useState } from "react";
import { Course } from "../../models";
import { useAuthSession, useCourse, useSnackbar } from "../../providers";
import CourseFormDialog from "./CourseFormDialog";

export default function EditCourseButton({
  course = new Course(),
  variant = "text",
}) {
  const { isAuth } = useAuthSession();
  const { updateCourse } = useCourse();
  const { pushSnack } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setValidationMessage("");
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    setValidationMessage("");
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const newCourse = await updateCourse(course.id, {
        title: data.get("title"),
        department: data.get("department"),
        description: data.get("description"),
      });
      pushSnack({
        message: `Updated ${newCourse.title}!`,
        severity: "success",
      });
      handleClose();
    } catch (error) {
      console.error(error);
      setValidationMessage(error.message || "Error updating course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant={variant} onClick={handleOpen} disabled={!isAuth()}>
        Edit
      </Button>
      <CourseFormDialog
        open={open}
        loading={loading}
        title="Edit course"
        submitLabel="Edit"
        validationMessage={validationMessage}
        course={course}
        handleSubmit={handleSubmit}
        handleClose={handleClose}
      />
    </>
  );
}
