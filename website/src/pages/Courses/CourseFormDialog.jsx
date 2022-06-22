import {
  Alert,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
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
        {loading ? (
          <LinearProgress />
        ) : (
          <LinearProgress variant="determinate" value={100} />
        )}
      </Box>
    </Dialog>
  );
}
