import {Paper, Typography } from "@mui/material";
import ModuleStack from "./ModuleStack";

export default function Roadmap() {
  return (
    <>
      <Paper elevation={5} sx={{ flexGrow: 1, p: 2 }} justifyContent="space-between">
        <Typography variant="h5">Roadmap</Typography>
      </Paper>
      <Paper elevation={5} sx={{ flexGrow: 1, p: 2 }} justifyContent="space-between">
        <ModuleStack />
      </Paper>
    </>
  );
}
