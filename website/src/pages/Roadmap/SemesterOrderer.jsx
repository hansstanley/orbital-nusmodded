import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { COLORS, ROADMAP, SEMESTER_TITLE } from "../../utils/constants";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useRoadmap } from "../../providers";

export default function SemesterOrderer() {
  const { loading, getSemesters, dragSemesters } = useRoadmap();
  const [open, setOpen] = useState(false);
  const [newSemesterId, setNewSemesterId] = useState(null);
  const newSemesterRef = useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onDragEnd = ({ source, destination, draggableId }) => {
    if (!source || !destination) return;

    dragSemesters(source.index, destination.index);
  };

  const onAdd = (semesterId) => {
    setNewSemesterId(semesterId);
    setTimeout(() => {
      newSemesterRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 500);
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
          <Stack spacing={1}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="semester-orderer">
                {(provided) => (
                  <Stack
                    spacing={1}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {getSemesters().map((sem, index) => (
                      <SemesterBar
                        key={sem.id}
                        sem={sem}
                        index={index}
                        isNew={sem.id === newSemesterId}
                      />
                    ))}
                    {provided.placeholder}
                  </Stack>
                )}
              </Droppable>
            </DragDropContext>
          </Stack>
          <div ref={newSemesterRef} />
        </DialogContent>
        <DialogActions>
          <AddSemesterButton onAdd={onAdd} />
          <Button onClick={handleClose}>Done</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function SemesterBar({ sem = {}, index, isNew = false }) {
  const { id, year, semester, modules, bgColor } = sem;

  const isDarkTheme = useTheme().palette.mode === "dark";
  const bgHex = COLORS[bgColor || "deepOrange"][isDarkTheme ? 900 : 200];

  const { setBgColorById, setYearById, setSemesterById } = useRoadmap();
  const [open, setOpen] = useState(false);

  const title = useMemo(() => {
    let yearPlaceholder = null;
    let semesterPlaceholder = null;

    if (typeof year !== "number") {
      yearPlaceholder = "?";
    }

    if (
      !Object.keys(SEMESTER_TITLE)
        .map((key) => parseInt(key))
        .includes(semester)
    ) {
      semesterPlaceholder = "Semester ?";
    }

    return `Year ${yearPlaceholder ?? year} ${
      semesterPlaceholder ?? SEMESTER_TITLE[semester]
    }`;
  }, [year, semester]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleYearChange = (year) => () => setYearById(id, year);
  const handleSemesterChange = (sem) => () => setSemesterById(id, sem);
  const handleBgColorChange = (colorKey) => () => setBgColorById(id, colorKey);

  const loadBgColorButtons = () => {
    return (
      <Grid>
        {Object.keys(COLORS).map((colorKey) => (
          <IconButton key={colorKey} onClick={handleBgColorChange(colorKey)}>
            <Avatar sx={{ bgcolor: COLORS[colorKey][isDarkTheme ? 900 : 200] }}>
              {colorKey === bgColor ? <DoneIcon /> : " "}
            </Avatar>
          </IconButton>
        ))}
      </Grid>
    );
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit semester</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <DialogContentText>Background colour:</DialogContentText>
            {loadBgColorButtons()}
            <DialogContentText>Year of study:</DialogContentText>
            <ButtonGroup>
              {[...Array(ROADMAP.YEAR_MAX_COUNT).keys()]
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
          <DeleteSemesterButton semesterId={id} />
          <Button onClick={handleClose}>Done</Button>
        </DialogActions>
      </Dialog>
      <Draggable draggableId={`${id}`} index={index}>
        {(provided) => (
          <Card
            sx={isNew ? { p: 1, border: 2, borderColor: "green" } : { p: 1 }}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: bgHex }}>
                <DragIndicatorIcon />
              </Avatar>
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
                  <Chip
                    key={code}
                    label={code[0] === "^" ? code.split("^")[3] : code}
                  />
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

function AddSemesterButton({ onAdd = () => {} }) {
  const { addSemester, getSemesters } = useRoadmap();

  const semestersPerYear = Object.keys(SEMESTER_TITLE).length;

  const disabled =
    getSemesters().length >= ROADMAP.YEAR_MAX_COUNT * semestersPerYear;

  const handleAdd = () => {
    const semesterId = addSemester({ year: null, semester: null });
    onAdd(semesterId);
  };

  return (
    <Button
      variant="outlined"
      startIcon={<AddIcon />}
      disabled={disabled}
      onClick={handleAdd}
    >
      Add semester
    </Button>
  );
}

function DeleteSemesterButton({ semesterId }) {
  const { deleteSemesterById } = useRoadmap();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = () => {
    deleteSemesterById(semesterId);
    handleClose();
  };

  return (
    <>
      <Button color="error" onClick={handleOpen}>
        Delete
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete semester</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you wish to delete this semester?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
