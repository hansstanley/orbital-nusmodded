import { Button } from "@mui/material";
import { useState } from "react";
import { useAuthSession, useCourse, useSnackbar } from "../../providers";
import CourseFormDialog from "./CourseFormDialog";

export default function AddCourseButton() {
  const { isAuth } = useAuthSession();
  const { createCourse } = useCourse();
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
      const course = await createCourse({
        title: data.get("title"),
        department: data.get("department"),
        description: data.get("description"),
      });
      pushSnack({
        message: `Created ${course.title}!`,
        severity: "success",
      });
      handleClose();
    } catch (error) {
      console.error(error);
      setValidationMessage(error.message || "Error creating course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={handleOpen} disabled={!isAuth()}>
        Add course
      </Button>
      <CourseFormDialog
        open={open}
        loading={loading}
        title="Add course"
        submitLabel="Add"
        validationMessage={validationMessage}
        handleSubmit={handleSubmit}
        handleClose={handleClose}
      />
    </>
  );
}
