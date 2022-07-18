import { Box, Button, Divider, Stack } from "@mui/material";
import Account from "../Account";

export default function CustomizeAccount({ handleNext = () => {} }) {
  return (
    <Stack spacing={2} alignItems="flex-start" flex={1}>
      <Box sx={{ width: "100%" }}>
        <Account />
      </Box>
      <Divider sx={{ width: "100%" }} />
      <Button variant="contained" onClick={handleNext}>
        Next
      </Button>
    </Stack>
  );
}
