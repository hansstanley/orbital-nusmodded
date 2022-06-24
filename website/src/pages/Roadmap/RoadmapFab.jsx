import * as React from 'react';
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import BackpackIcon from "@mui/icons-material/Backpack";
import BookIcon from "@mui/icons-material/Book";

export default function RoadmapFab({onClick}) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = (event) => {
    setOpen(!open);
  };

  return (
    <SpeedDial
      ariaLabel="Roadmap SpeedDial"
      icon={<SpeedDialIcon />}
      sx={{ position: "absolute", bottom: 32, right: 32 }}
      onClick={handleOpen}
      open={open}
    >
      <SpeedDialAction
        icon={<BackpackIcon />}
        tooltipTitle="My module groups"
      />
      <SpeedDialAction icon={<BookIcon />} tooltipTitle="My modules" onClick = {onClick}/>
    </SpeedDial>
  );
}
