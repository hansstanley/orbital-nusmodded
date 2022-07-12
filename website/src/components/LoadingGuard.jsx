import { Box, CircularProgress, Stack, Typography } from "@mui/material";

export default function LoadingGuard({ children, loading = false }) {
  return loading ? (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h3" color="primary" sx={{ fontWeight: "bold" }}>
          NUSMODDED
        </Typography>
        <CircularProgress />
      </Stack>
    </Box>
  ) : (
    children
  );
}
