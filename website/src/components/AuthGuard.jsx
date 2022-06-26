import {
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useAuthSession } from "../providers";
import AuthButtonGroup from "./AuthButtonGroup";

export default function AuthGuard({ children }) {
  const { loading, isAuth } = useAuthSession();

  return isAuth() ? (
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
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h3" color="primary" sx={{ fontWeight: "bold" }}>
          NUSMODDED
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography>Please login to use this feature</Typography>
            <AuthButtonGroup />
          </>
        )}
      </Stack>
    </Box>
  );
}
