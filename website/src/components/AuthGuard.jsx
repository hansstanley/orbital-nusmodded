import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useAccessToken } from "../providers";
import AuthButtonGroup from "./AuthButtonGroup";

export default function AuthGuard({ children }) {
  const { hasAccess } = useAccessToken();

  return hasAccess ? (
    children
  ) : (
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
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Typography variant="h3" color="primary" sx={{ fontWeight: "bold" }}>
          NUSMODDED
        </Typography>
        <Typography>Please login to use this feature</Typography>
        <AuthButtonGroup />
      </Stack>
    </Box>
  );
}
