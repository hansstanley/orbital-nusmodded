import { useEffect, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Paper,
  Stack,
  Typography,
  Divider,
  Box,
  Skeleton,
  ButtonGroup,
  Button,
  IconButton,
  Collapse,
  Zoom,
} from "@mui/material";
import { ModuleBox, ModuleStack as ModStack } from "../../components/Mod";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import BookIcon from "@mui/icons-material/Book";
import RightDrawer from "./RightDrawer";
import { useBackend, useRoadmap } from "../../providers";
import { useSnackbar } from "../../providers";
import { ROADMAP_TEMPLATE, ROADMAP } from "../../utils/constants";
import SemesterOrderer from "./SemesterOrderer";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Semester({ sem, index }) {
  const { id, year, semester, modules } = sem;
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen(!open);

  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <Button
        variant="outlined"
        endIcon={open ? <ArrowLeftIcon /> : <ArrowRightIcon />}
        onClick={toggleOpen}
      >
        Y{year}S{semester}
      </Button>
      <Divider orientation="vertical" />
      <Droppable droppableId={id} direction="horizontal">
        {(provided) => (
          <Stack
            spacing={1}
            direction="row"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {modules?.map((moduleCode, index) => (
              <ModuleBox
                moduleCode={moduleCode}
                key={moduleCode}
                index={index}
                isDraggable={true}
              />
            ))}
            {modules?.length ? null : (
              <Typography>Drag modules here</Typography>
            )}
            {provided.placeholder}
          </Stack>
        )}
      </Droppable>
      <Divider orientation="vertical" />
    </Stack>
  );
}

export default function RoadmapStack() {
  const {
    loading,
    roadmap,
    dragMods,
    getSemesters,
    getSemesterById,
    setModulesById,
  } = useRoadmap();
  const { pushSnack } = useSnackbar();
  const [roadMap, setRoadMap] = useState([]);

  const allMods = useMemo(
    () =>
      roadmap.reduce(
        (prev, currSem) => prev.concat(currSem?.modules || []),
        []
      ),
    [roadmap]
  );

  const myMods = useMemo(
    () =>
      getSemesterById(ROADMAP.MY_MODS_ID)?.modules?.map((moduleCode) => ({
        moduleCode,
      })) || [],
    [getSemesterById]
  );

  const onDragEnd = ({ source, destination, draggableId }) => {
    if (!source || !destination) return;

    dragMods(
      source.index,
      source.droppableId,
      destination.index,
      destination.droppableId
    );
  };

  const handleAddMyMods = (moduleCodes = []) => {
    const holdingSem = getSemesterById(ROADMAP.MY_MODS_ID);
    const newCodes = moduleCodes.filter((code) => !allMods.includes(code));

    const holdingCodes = newCodes.concat(holdingSem?.modules || []);
    setModulesById(ROADMAP.MY_MODS_ID, holdingCodes);

    return newCodes;
  };

  const handleDeleteMyMod = (moduleCode) => {
    const holdingSem = getSemesterById(ROADMAP.MY_MODS_ID);
    const holdingCodes =
      holdingSem?.modules?.filter((code) => code !== moduleCode) || [];

    setModulesById(ROADMAP.MY_MODS_ID, holdingCodes);
  };

  return (
    <>
      <Stack spacing={1.5} width="100%" overflow="auto">
        <SemesterOrderer />
        <DragDropContext onDragEnd={onDragEnd}>
          {loading
            ? [...Array(4).keys()].map((key) => (
                <Stack spacing={2} key={key}>
                  <Skeleton variant="rectangular" width="100%">
                    <Box sx={{ width: "100%", height: 120 }} />
                  </Skeleton>
                </Stack>
              ))
            : getSemesters().map((sem, index) => (
                <Semester key={sem.id} sem={sem} index={index} />
              ))}
          <RightDrawer
            items={[
              {
                icon: <BookIcon />,
                label: "My modules",
              },
            ]}
          >
            <ModStack
              mods={myMods}
              isDroppable={true}
              droppableId={ROADMAP.MY_MODS_ID}
              handleAddMods={handleAddMyMods}
              handleDeleteMod={handleDeleteMyMod}
            />
            <div />
          </RightDrawer>
        </DragDropContext>
      </Stack>
    </>
  );
}
