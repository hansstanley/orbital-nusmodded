import * as React from "react";
import { styled } from "@mui/material/styles";
import { Paper, Stack, Typography, Divider, Box } from "@mui/material";
import { RoadmapperService } from "../../services";
import ModuleBox from "./ModuleBox";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {SortableContainer, SortableElement } from 'react-sortable-hoc';
import {arrayMoveImmutable} from 'array-move';

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

  return (
    <Droppable droppableId={String(index + 1)} direction="horizontal">
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
  const [roadMap, setRoadMap] = React.useState(roadmapperService.getRoadmap());

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

        return roadmap;
      });
    }
  };

  return (
    <Stack spacing={1.5}>
    <DragDropContext onDragEnd={onDragEnd}>
      {roadmapperService.getRoadmap().map((sem, index) => (
        <Semester
          modules={sem.modules}
          year={sem.year}
          semester={sem.semester}
          index={index}
        />
      ))}
      </DragDropContext>
    </Stack>
  );
}
