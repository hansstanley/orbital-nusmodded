import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useModGroup } from "../../providers";
import ModGroupBox from "./ModGroupBox";

export default function ModGroupStack({ modGroups = [] }) {
  const { getModGroupMods } = useModGroup();

  return (
    <Stack spacing={1} width={320}>
      <Typography variant="h6">Module groups</Typography>
      <Divider />
      <Box>
        {modGroups.length ? (
          modGroups.map((modGroup) => (
            <ModGroupBox key={modGroup.id} modGroup={modGroup} />
          ))
        ) : (
          <Typography variant="body2">No module groups.</Typography>
        )}
      </Box>
    </Stack>
  );
}
