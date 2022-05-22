import { Typography } from "@mui/material";
import { Paper } from "@mui/material";

export default function Login() {
  return (
    <>
      <Paper elevation={5} sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h5">Login</Typography>
      </Paper>
    </>
  );
}
