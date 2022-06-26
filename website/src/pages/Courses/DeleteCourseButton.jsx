import {
  Alert,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Course } from "../../models";
import { useAuthSession, useCourse, useSnackbar } from "../../providers";

export default function DeleteCourseButton({
  course = new Course(),
  variant = "text",
}) {
  const navigate = useNavigate();
  const { isAuth } = useAuthSession();
  const { deleteCourse } = useCourse();
  const { pushSnack } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState(true);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    setMatch(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (data.get("title") !== course.title) {
      setTimeout(() => {
        setMatch(false);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const deleted = await deleteCourse(course.id);
      pushSnack({
        message: `Deleted ${deleted.title}!`,
        severity: "success",
      });
      navigate("/courses");
      handleClose();
    } catch (error) {
      console.error(error);
      pushSnack({
        message: error.message || `Unable to delete ${course.title}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        color="error"
        variant={variant}
        onClick={handleOpen}
        disabled={!isAuth()}
      >
        Delete
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>Confirm course deletion</DialogTitle>
          <DialogContent dividers={true}>
            <Stack spacing={2}>
              <Alert severity="warning">This action cannot be undone.</Alert>
              <Typography>
                This will permanently delete the <b>{course.title}</b> course
                and all of its data.
              </Typography>
              <Divider />
              <Typography>
                Type <b>{course.title}</b> to confirm:
              </Typography>
              <TextField
                name="title"
                label="Course title"
                type="text"
                autoFocus
                fullWidth
                required
              />
              <Collapse in={!match}>
                <Alert severity="error">Course title does not match.</Alert>
              </Collapse>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              color="error"
              type="submit"
              variant="contained"
              disabled={loading}
            >
              Delete {course.title}
            </Button>
          </DialogActions>
          {loading ? (
            <LinearProgress />
          ) : (
            <LinearProgress variant="determinate" value={100} />
          )}
        </Box>
      </Dialog>
    </>
  );
}
