import * as React from "react";
import { styled } from "@mui/material/styles";
import { Paper, Stack, Typography, Divider, Box } from "@mui/material";
import { RoadmapperService } from "../../services";
import ModuleBox from "./ModuleBox";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import RightDrawer from "./RightDrawer";
import { supabase } from "../../services";
import {useBackend } from "../../providers";
import { useAuthSession, useSnackbar } from "../../providers";


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const roadmapperService = new RoadmapperService();

 function Semester(props) {
  const { modules, year, semester, index } = props;

  if (year === null) {
    return <></>;
  }

  return (
    <Droppable droppableId={String(index + 1)} direction="horizontal" >
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <Stack spacing={1} direction = "row" ref = {provided.innerRef}>
            <Typography variant="h6" sx={{ alignSelf: "center" }}>
              Y{year}S{semester}
            </Typography>
            <Divider />
            {modules.map((moduleCode, index) => (
              <ModuleBox moduleCode={moduleCode} key={moduleCode} index = {index} />
            ))}
          </Stack>
        </div>
      )}
      </Droppable>
  );
} 

export default function NestedGrid() {

  // const {makeRequest} = useBackend();
  // const {status, data} = makeRequest({
  //   method: "get",
  //   route: "/user-settings",
  //   data: {key: "roadmap", value: "..." },
  //   isPublic: false
  //   });
  // console.log(data);
  const { profile, updateProfile } = useAuthSession();
  const [roadMap, setRoadMap] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [allMods, setAllMods] = React.useState([]);

  React.useEffect(() => {
    if (profile) {
      setRoadMap(profile.roadmap);
      setLoading(false);
      setAllMods(profile.roadmap.reduce((prevSem, currSem) => prevSem.concat(currSem.modules), []));
    }
  }, [profile]);

  const handleUpdate = async (roadmap) => {
    try {
      const updates = {
        id: profile.id,
        username: profile.username,
        avatar_url: profile.avatarUrl,
        roadmap: roadmap,
        updated_at: new Date(),
      };

      await updateProfile(updates);

    } catch (error) {
      console.error(error);
    }
  };

  const onDragEnd = ({ source, destination, draggableId }) => {
    // dropped inside of the list
    if (source && destination) {
      setRoadMap(prevState => {
        const { index: sourceIndex, droppableId: sourceId } = source;

        const {
          index: destinationIndex,
          droppableId: destinationId
        } = destination;
     
        const sourceSemester = prevState.find(
          sem => parseInt(sem.id) === parseInt(sourceId)
        );

        const destinationSemester = prevState.find(
          sem => parseInt(sem.id) === parseInt(destinationId)
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
          modules: sourceModules
        };

        const newDestinationSemester = {
          ...destinationSemester,
          modules: destinationModules
        };

        const roadmap = prevState.map(roadmap => {
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

        console.log(roadmap.find(sem => parseInt(sem.id) === parseInt("-1")));
        
        handleUpdate(roadmap);

        return roadmap;
      });
    }
  };

  const handleAdd = (selected) => {
    setRoadMap(prevState => {
      const holdingSemester = prevState.find(
        sem => parseInt(sem.id) === -1
      );
      const sourceModules = selected.map((mod) => mod.moduleCode).concat(holdingSemester.modules);
      const newHoldingSemester = {
        ...holdingSemester,
        modules: sourceModules
      };
      const roadmap = prevState.map(roadmap => {
        if (roadmap.id === newHoldingSemester.id) {
          return newHoldingSemester;
        } else {
          return roadmap;
        }
      });

      handleUpdate(roadmap);

      return roadmap;
    });
  }

  const handleDelete = (moduleCode) => {
    setRoadMap(prevState => {
      const holdingSemester = prevState.find(
        sem => parseInt(sem.id) === -1
      );
      const sourceModules = holdingSemester.modules;

      const newHoldingSemester = {
        ...holdingSemester,
        modules: sourceModules.filter(mod => mod !== moduleCode)
      };
      const roadmap = prevState.map(roadmap => {
        if (roadmap.id === newHoldingSemester.id) {
          return newHoldingSemester;
        } else {
          return roadmap;
        }
      });

      handleUpdate(roadmap);
      console.log(moduleCode);
      return roadmap;
    });
  }

  return (
    <Stack spacing={1.5}>
    <DragDropContext onDragEnd={onDragEnd}>
      {!loading ? roadMap.map((sem, index) => (
        <Semester
          modules={sem.modules}
          year={sem.year}
          semester={sem.semester}
          index={index}
        />
      )): <></>}
      <RightDrawer roadMap = {roadMap} handleAdd = {handleAdd} loadingProfile = {loading} allMods = {allMods} handleDelete = {handleDelete}/>
      </DragDropContext>
    </Stack>
  );
}
