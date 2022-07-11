import { Button, Typography, Stack, Divider, Box } from "@mui/material";
import Settings from "../Settings";
import { useAuthSession } from "../../providers";

export default function CustomizeSettings({ handleNext = () => {} }) {
  const { isAuth } = useAuthSession();

  return isAuth() ? (
    <Stack spacing={2} alignItems="flex-start" flex={1}>
      <Settings />
      <Divider sx={{ width: "100%" }} />
      <Button variant="contained" onClick={handleNext}>
        Next
      </Button>
    </Stack>
  ) : (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h6">
        Please check your email for the verification link!
      </Typography>
    </Box>
  );
}
