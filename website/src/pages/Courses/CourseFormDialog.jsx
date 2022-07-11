import {
  Alert,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { LoadingBar } from "../../components";
import { Course } from "../../models";

export default function CourseFormDialog({
  open = false,
  loading = false,
  title = "",
  submitLabel = "Submit",
  validationMessage = "",
  course = new Course(),
  handleSubmit = (event) => {},
  handleClose = () => {},
}) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <TextField
            name="title"
            label="Course Title"
            type="text"
            helperText="E.g. Computer Science"
            defaultValue={course.title}
            margin="dense"
            autoFocus
            fullWidth
            required
          />
          <TextField
            name="department"
            label="Department"
            type="text"
            helperText="E.g. School of Computing"
            defaultValue={course.department}
            margin="dense"
            fullWidth
            required
          />
          <TextField
            name="description"
            label="Description"
            type="text"
            helperText="A short description of the course"
            defaultValue={course.description}
            margin="dense"
            fullWidth
            required
            multiline
            minRows={4}
            maxRows={10}
          />
          <Collapse in={!!validationMessage}>
            <Alert severity="error">{validationMessage}</Alert>
          </Collapse>
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" disabled={loading}>
            {submitLabel}
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
        <LoadingBar loading={loading} />
      </Box>
    </Dialog>
  );
}
