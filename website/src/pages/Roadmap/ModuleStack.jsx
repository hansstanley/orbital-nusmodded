import * as React from "react";
import { styled } from "@mui/material/styles";
import {Paper, Grid, Box } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const filler = "Placeholder Module";

function Module(props) {
  return (
      <Grid item xs={4}>
        <Item>{props.info}</Item>
      </Grid>
  );
}

function toYear(num) {
  const year = num % 2 === 0 ? num / 2 : num / 2 + 0.5;
  const semester = num % 2 === 0 ? 2 : num % 2;
  return "Y" + year + "S" + semester;
}

function Semester(props) {
  return (
    <Box elevation={0} sx={{ flexGrow: 1, p: 1 }}>
      <Grid container direction = "column" item spacing={3} justifyContent="center" alignItems="center">
      <Box>
        {toYear(props.semester)}
      </Box>
      <Module info = {filler}/>
      <Module info = {filler}/>
      <Module info = {filler}/>
      <Module info = {filler}/>
      <Module info = {filler}/>
      </Grid>
    </Box>
  );
}

export default function NestedGrid() {
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-evenly"
      alignItems="center"
    >
      <Semester semester = {1}/>
      <Semester semester = {2}/>
      <Semester semester = {3}/>
      <Semester semester = {4}/>
      <Semester semester = {5}/>
      <Semester semester = {6}/>
      <Semester semester = {7}/>
      <Semester semester = {8}/>

    </Grid>
  );
}
