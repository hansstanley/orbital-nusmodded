import { Box, Paper, Toolbar } from "@mui/material";

export default function MainFrame({ children }) {
  return (
    <Box component="main" sx={{ p: 2, height: "100vh", width: "100vw" }}>
      <Toolbar />
      <Paper
        elevation={5}
        sx={{
          display: "flex",
          flex: 1,
          height: "calc(100% - 64px)",
          p: 2,
          overflow: "auto",
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}
