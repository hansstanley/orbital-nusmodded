import * as React from "react";
import { styled } from "@mui/material/styles";
import { Paper, Stack, Typography, Divider } from "@mui/material";
import { RoadmapperService } from "../../services";
import ModuleBox from "./ModuleBox";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const roadmapperService = new RoadmapperService();

// function Module(props) {
//   return (
//     <Grid item xs={4}>
//       <Item>{props.info}</Item>
//     </Grid>
//   );
// }

// function toYear(num) {
//   const year = num % 2 === 0 ? num / 2 : num / 2 + 0.5;
//   const semester = num % 2 === 0 ? 2 : num % 2;
//   return "Y" + year + "S" + semester;
// }

function Semester(props) {
  const { modules, year, semester } = props;

  return (
    <Stack spacing={1}>
      <Typography variant="h6" sx={{ alignSelf: "center" }}>
        Y{year}S{semester}
      </Typography>
      <Divider />
      {modules.map((moduleCode, index) => (
        <ModuleBox moduleCode={moduleCode} key={index} />
      ))}
    </Stack>
  );
}

export default function NestedGrid() {
  return (
    <Stack direction="row" spacing={2}>
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
