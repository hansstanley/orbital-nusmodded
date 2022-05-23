import { Typography } from "@mui/material";
import { Paper } from "@mui/material";
import Select from "./Select";

export default function Settings() {
  return (
    <>
      <Paper elevation={5} sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h5">Settings</Typography>
      </Paper>
      <Select/>
    </>
  );
}
