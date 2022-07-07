import { useEffect, useMemo, useState } from "react";
import { Stack, Typography, Divider, Box, Skeleton, Chip } from "@mui/material";
import { ModuleBox, ModuleStack as ModStack } from "../../components/Mod";
import { ModGroupStack } from "../../components/ModGroup";
import ModGroupBox from "./ModGroupBox";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import BookIcon from "@mui/icons-material/Book";
import BackpackIcon from "@mui/icons-material/Backpack";
import RightDrawer from "./RightDrawer";
import { useRoadmap, useCourse } from "../../providers";
import { ROADMAP, SEMESTER_TITLE } from "../../utils/constants";
import SemesterOrderer from "./SemesterOrderer";
import RoadmapGenerator from "./RoadmapGenerator";

function Semester({ sem }) {
  const { id, year, semester, modules } = sem;

  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <Divider orientation="vertical" />
      <Stack spacing={2} alignItems="flex-start">
        <Chip
          label={`Year ${year || "?"} ${
            Object.keys(SEMESTER_TITLE)
              .map((key) => parseInt(key))
              .includes(semester)
              ? SEMESTER_TITLE[semester]
              : "Semester ?"
          }`}
        />
        <Droppable droppableId={id} direction="horizontal">
          {(provided) => (
            <Stack
              spacing={1}
              direction="row"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {modules?.map((moduleCode, index) => (
                moduleCode[0] !== "^" ?
                <ModuleBox
                  moduleCode={moduleCode}
                  key={moduleCode}
                  index={index}
                  isDraggable={true}
                /> :
                <ModGroupBox
                  name={moduleCode}
                  key={moduleCode}
                  index={index}
                  isDraggable={true}
                />
              ))}
              {modules?.length ? null : (
                <Typography
                  sx={{
                    borderColor: "gray",
                    borderRadius: 1,
                    borderStyle: "dashed",
                    p: 4,
                  }}
                >
                  Drag modules here
                </Typography>
              )}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </Stack>
      <Divider orientation="vertical" />
    </Stack>
  );
}

export default function RoadmapStack() {
  const {
    loading,
    dragMods,
    getSemesters,
    getSemesterById,
    setModulesById,
    getAllMods,
    checkSemestersMC,
    checkSemestersPrereq,
  } = useRoadmap();

  const {
    getCourseModGroups,
    getCourseId,
  } = useCourse();

  const [modGroups, setModGroups] = useState([]);

  const allMods = getAllMods();

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


    if (checkSemestersMC(getSemesters()) || checkSemestersPrereq(getSemesters(), draggableId)) {
      dragMods(
        destination.index,
        destination.droppableId,
        source.index,
        source.droppableId
      );
    }

    
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

  useEffect(() => {
    async function loadModGroups(courseId) {
      const data = await getCourseModGroups(courseId);
      setModGroups(data);
    }
    if (getCourseId() !== "") {
      loadModGroups(getCourseId());
    }
  }, [getCourseModGroups, getCourseId]);

  return (
    <>
      <Stack spacing={2} width="100%" overflow="auto">
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
            : getSemesters().map((sem) => <Semester key={sem.id} sem={sem} />)}
          <RightDrawer
            items={[
              {
                icon: <BookIcon />,
                label: "My modules",
              },
              {
                icon: <BackpackIcon />,
                label: "My module groups",
              }
            ]}
          >
            <ModStack
              mods={myMods}
              isDroppable={true}
              droppableId={ROADMAP.MY_MODS_ID}
              handleAddMods={handleAddMyMods}
              handleDeleteMod={handleDeleteMyMod}
            />
            <ModGroupStack
              modGroups={modGroups}
              isDroppable={true}
              droppableId={"modgroup"}
              isCourse = {true}
            />
            <div />
          </RightDrawer>
        </DragDropContext>
      </Stack>
      {/* <RoadmapGenerator /> */}
    </>
  );
}
