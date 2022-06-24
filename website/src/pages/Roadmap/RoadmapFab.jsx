import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import BackpackIcon from "@mui/icons-material/Backpack";
import BookIcon from "@mui/icons-material/Book";

export default function RoadmapFab({onClick}) {
  return (
    <SpeedDial
      ariaLabel="Roadmap SpeedDial"
      icon={<SpeedDialIcon />}
      sx={{ position: "absolute", bottom: 32, right: 32 }}
    >
      <SpeedDialAction
        icon={<BackpackIcon />}
        tooltipTitle="My module groups"
      />
      <SpeedDialAction icon={<BookIcon />} tooltipTitle="My modules" onClick = {onClick}/>
    </SpeedDial>
  );
}
