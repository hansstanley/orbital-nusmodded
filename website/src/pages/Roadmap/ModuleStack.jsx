import { useEffect, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Paper,
  Stack,
  Typography,
  Divider,
  Box,
  Skeleton,
} from "@mui/material";
import { ModuleBox, ModuleStack as ModStack } from "../../components/Mod";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import BookIcon from "@mui/icons-material/Book";
import RightDrawer from "./RightDrawer";
import { useBackend } from "../../providers";
import { useSnackbar } from "../../providers";
import { ROADMAP_TEMPLATE } from "../../utils/constants";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Semester({ modules, year, semester, index }) {
  if (year === null) {
    return <></>;
  }

  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <Typography variant="h6" sx={{ alignSelf: "center" }}>
        Y{year} S{semester}
      </Typography>
      <Divider orientation="vertical" />
      <Droppable droppableId={String(index + 1)} direction="horizontal">
        {(provided) => (
          <Stack
            spacing={1}
            direction="row"
            alignItems="center"
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
              <Typography>Drag modules here.</Typography>
            )}
            {provided.placeholder}
          </Stack>
        )}
      </Droppable>
    </Stack>
  );
}

export default function NestedGrid() {
  const { makeRequest } = useBackend();
  const { pushSnack } = useSnackbar();
  const [roadMap, setRoadMap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allMods, setAllMods] = useState([]);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const { status, data } = await makeRequest({
          method: "get",
          route: "/user-settings",
          isPublic: false,
        });

        if (status === 200 && Array.isArray(data?.ROADMAP)) {
          setRoadMap(data.ROADMAP);
        } else {
          setRoadMap(ROADMAP_TEMPLATE);
        }
      } catch (error) {
        console.error(error);
        pushSnack({
          message: "Unable to retrieve roadmap",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [makeRequest, pushSnack]);

  useEffect(() => {
    async function saveRoadmap() {
      try {
        const { status } = await makeRequest({
          method: "post",
          route: "/user-settings/edit",
          data: {
            key: "ROADMAP",
            value: roadMap,
          },
          isPublic: false,
        });

        if (status !== 200) {
          throw new Error("Unable to save roadmap");
        }
      } catch (error) {
        console.error(error);
        pushSnack({
          message: error.message || "Unable to save roadmap",
          severity: "error",
        });
      }
    }

    if (Array.isArray(roadMap) && roadMap.length) {
      saveRoadmap();
      setAllMods(
        roadMap.reduce(
          (prev, currSem) => prev.concat(currSem?.modules || []),
          []
        )
      );
    }
  }, [roadMap, makeRequest, pushSnack]);

  const onDragEnd = ({ source, destination, draggableId }) => {
    // dropped inside of the list
    if (source && destination) {
      setRoadMap((prevState) => {
        const { index: sourceIndex, droppableId: sourceId } = source;

        const { index: destinationIndex, droppableId: destinationId } =
          destination;

        const sourceSemester = prevState.find(
          (sem) => parseInt(sem.id) === parseInt(sourceId)
        );

        const destinationSemester = prevState.find(
          (sem) => parseInt(sem.id) === parseInt(destinationId)
        );

        const sourceModules = sourceSemester.modules;

        const destinationModules = destinationSemester.modules;

        const isSameSemester = sourceSemester.id === destinationSemester.id;

        sourceModules.splice(sourceIndex, 1);

        if (isSameSemester) {
          sourceModules.splice(destinationIndex, 0, draggableId);
        } else {
          destinationModules.splice(destinationIndex, 0, draggableId);
        }

        const newSourceSemester = {
          ...sourceSemester,
          modules: sourceModules,
        };

        const newDestinationSemester = {
          ...destinationSemester,
          modules: destinationModules,
        };

        const roadmap = prevState.map((roadmap) => {
          if (roadmap.id === newSourceSemester.id) {
            return newSourceSemester;
          } else if (
            roadmap.id === newDestinationSemester.id &&
            !isSameSemester
          ) {
            return newDestinationSemester;
          } else {
            return roadmap;
          }
        });

        return roadmap;
      });
    }
  };

  const myMods = useMemo(
    () =>
      roadMap
        ?.find((sem) => parseInt(sem.id) === -1)
        ?.modules?.map((moduleCode) => ({ moduleCode })) || [],

    [roadMap]
  );

  const handleAddMyMods = (moduleCodes = []) => {
    const holdingSem = roadMap.find((sem) => parseInt(sem.id) === -1);
    const { modules: currCodes, ...others } = holdingSem;
    const newCodes = moduleCodes.filter(
      (code) => !allMods.includes(code) && !currCodes?.includes(code)
    );
    const holdingCodes = newCodes.concat(holdingSem.modules || []);
    const newHoldingSem = {
      modules: holdingCodes,
      ...others,
    };

    const newRoadmap = roadMap.map((sem) =>
      sem.id === newHoldingSem.id ? newHoldingSem : sem
    );
    setRoadMap(newRoadmap);

    return newCodes;
  };

  const handleDeleteMyMod = (moduleCode) => {
    const holdingSem = roadMap.find((sem) => parseInt(sem.id) === -1);
    const { modules: currCodes, ...others } = holdingSem;
    const newHoldingSem = {
      modules: currCodes?.filter((code) => code !== moduleCode) || [],
      ...others,
    };

    const newRoadmap = roadMap.map((sem) =>
      sem.id === newHoldingSem.id ? newHoldingSem : sem
    );
    setRoadMap(newRoadmap);
  };

  const handleAdd = (selected) => {
    setRoadMap((prevState) => {
      const holdingSemester = prevState.find((sem) => parseInt(sem.id) === -1);
      const sourceModules = selected
        .map((mod) => mod.moduleCode)
        .concat(holdingSemester.modules);
      const newHoldingSemester = {
        ...holdingSemester,
        modules: sourceModules,
      };
      const roadmap = prevState.map((roadmap) => {
        if (roadmap.id === newHoldingSemester.id) {
          return newHoldingSemester;
        } else {
          return roadmap;
        }
      });

      return roadmap;
    });
  };

  const handleDelete = (moduleCode) => {
    setRoadMap((prevState) => {
      const holdingSemester = prevState.find((sem) => parseInt(sem.id) === -1);
      const sourceModules = holdingSemester.modules;

      const newHoldingSemester = {
        ...holdingSemester,
        modules: sourceModules.filter((mod) => mod !== moduleCode),
      };
      const roadmap = prevState.map((roadmap) => {
        if (roadmap.id === newHoldingSemester.id) {
          return newHoldingSemester;
        } else {
          return roadmap;
        }
      });

      return roadmap;
    });
  };

  return (
    <>
      <Stack spacing={1.5} width="100%" overflow="auto">
        <DragDropContext onDragEnd={onDragEnd}>
          {loading
            ? [...Array(4).keys()].map((key) => (
                <Stack spacing={2} key={key}>
                  <Skeleton variant="rectangular" width="100%">
                    <Box sx={{ width: "100%", height: 120 }} />
                  </Skeleton>
                </Stack>
              ))
            : roadMap.map((sem, index) => (
                <Semester
                  key={index}
                  modules={sem.modules}
                  year={sem.year}
                  semester={sem.semester}
                  index={index}
                />
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
              droppableId="-1"
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
