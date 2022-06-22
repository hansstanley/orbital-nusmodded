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


const SortableItem = SortableElement(({ moduleCode, index }) => (
  <ModuleBox moduleCode={moduleCode} key={index} />
));

const SortableList = SortableContainer(({ items }) => (
  <Stack direction="row" spacing = {2}>
    {items.map((moduleCode, index) => (
      <SortableItem moduleCode={moduleCode} index={index} />
    ))}
  </Stack>
));

function Semester(props) {
  const { modules, year, semester } = props;
  const [moduleList, setModuleList] = React.useState(modules);

  const onSortEnd = ({oldIndex, newIndex}) => {
    setModuleList(arrayMoveImmutable(moduleList, oldIndex, newIndex));
  };


  return (
    <Stack spacing={1} direction = "row">
      <Typography variant="h6" sx={{ alignSelf: "center" }}>
        Y{year}S{semester}
      </Typography>
      <Divider />
      <SortableList
					axis={'xy'}
          distance={1}
					items={moduleList}
					onSortEnd={onSortEnd}
          onSortStart={(_, event) => event.preventDefault()}
				/>
    </Stack>
  );
}

/* function Semester(props) {
  const { modules, year, semester } = props;

  return (
    <Stack spacing={1} direction = "row">
      <Typography variant="h6" sx={{ alignSelf: "center" }}>
        Y{year}S{semester}
      </Typography>
      <Divider />
      {modules.map((moduleCode, index) => (
        <ModuleBox moduleCode={moduleCode} key={index} />
      ))}
    </Stack>
  );
} */

export default function NestedGrid() {
  return (
    <Stack spacing={1.5}>
      {roadmapperService.getRoadmap().map((sem, index) => (
        <Semester
          modules={sem.modules}
          year={sem.year}
          semester={sem.semester}
          key={index}
        />
      ))}
    </Stack>
  );
}
