import { Button, Stack, Divider } from "@mui/material";
import Settings from "../Settings";

export default function CustomizeSettings({ handleNext = () => {} }) {
  return (
    <Stack spacing={2} alignItems="flex-start" flex={1}>
      <Settings />
      <Divider sx={{ width: "100%" }} />
      <Button variant="contained" onClick={handleNext}>
        Next
      </Button>
    </Stack>
  );
}
