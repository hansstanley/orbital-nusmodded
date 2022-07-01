import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { SEMESTER_TITLE } from "../../utils/constants";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useRoadmap } from "../../providers";

export default function SemesterOrderer() {
  const { loading, getSemesters, dragSemesters } = useRoadmap();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onDragEnd = ({ source, destination, draggableId }) => {
    if (!source || !destination) return;

    dragSemesters(source.index, destination.index);
  };

  return (
    <>
      <Box>
        <Button
          variant="contained"
          disabled={open || loading}
          onClick={handleOpen}
        >
          Edit semesters
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="lg">
        <DialogContent>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="semester-orderer">
              {(provided) => (
                <Stack
                  spacing={1}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {getSemesters().map((sem, index) => (
                    <SemesterBar key={sem.id} sem={sem} index={index} />
                  ))}
                  {provided.placeholder}
                </Stack>
              )}
            </Droppable>
          </DragDropContext>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Done</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function SemesterBar({ sem = {}, index }) {
  const { id, year, semester, modules } = sem;

  const { setYearById, setSemesterById } = useRoadmap();
  const [open, setOpen] = useState(false);

  const title = useMemo(() => {
    if (typeof year !== "number") {
      return `Unknown year ${year}`;
    }

    if (
      !Object.keys(SEMESTER_TITLE)
        .map((key) => parseInt(key))
        .includes(semester)
    ) {
      return `Unknown semester ${semester}`;
    }

    return `Year ${year} ${SEMESTER_TITLE[semester]}`;
  }, [year, semester]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleYearChange = (year) => () => setYearById(id, year);
  const handleSemesterChange = (sem) => () => setSemesterById(id, sem);

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit semester</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <DialogContentText>Year of study:</DialogContentText>
            <ButtonGroup>
              {[...Array(10).keys()]
                .map((key) => (key += 1))
                .map((key) => (
                  <Button
                    key={key}
                    disabled={key === year}
                    onClick={handleYearChange(key)}
                  >
                    {key}
                  </Button>
                ))}
            </ButtonGroup>
            <DialogContentText>Semester:</DialogContentText>
            <ButtonGroup orientation="vertical">
              {Object.keys(SEMESTER_TITLE)
                .map((key) => parseInt(key))
                .map((key) => (
                  <Button
                    key={key}
                    disabled={key === semester}
                    onClick={handleSemesterChange(key)}
                  >
                    {SEMESTER_TITLE[key]}
                  </Button>
                ))}
            </ButtonGroup>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Done</Button>
        </DialogActions>
      </Dialog>
      <Draggable draggableId={`${id}`} index={index}>
        {(provided) => (
          <Card
            sx={{ p: 1 }}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <DragIndicatorIcon />
              <Typography variant="overline" sx={{ flex: 1 }}>
                {title}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                overflow="auto"
                padding={1}
                sx={{ border: 1, borderRadius: 6, borderColor: "gray" }}
              >
                {modules.map((code) => (
                  <Chip key={code} label={code} />
                ))}
                {modules.length ? null : <Chip label="No modules" />}
              </Stack>
              <Button onClick={handleOpen}>Edit</Button>
            </Stack>
          </Card>
        )}
      </Draggable>
    </>
  );
}
