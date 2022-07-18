import {
  Divider,
  Card,
  Slide,
  CardHeader,
  CardContent,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Fab,
  Zoom,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import BlockIcon from "@mui/icons-material/Block";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from "@mui/icons-material/Edit";
import { DIMENSIONS } from "../../utils/constants";

/**
 * Drawer for roadmap modifications.
 *
 * @param {object} props
 * @returns A slide-in drawer from the right.
 */
export default function RightDrawer({
  items = [], // { icon, label }
  children,
}) {
  const [expand, setExpand] = useState(false);
  const [open, setOpen] = useState(false);
  const [drawerIndex, setDrawerIndex] = useState(0);
  const [drawerTitle, setDrawerTitle] = useState(null);

  const toggleSpeedDial = () => setExpand(!expand);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleSelect = (title, index) => () => {
    setDrawerTitle(title);
    setDrawerIndex(index);
    handleDrawerOpen();
  };

  return (
    <>
      <SpeedDial
        ariaLabel="Roadmap SpeedDial"
        icon={<SpeedDialIcon />}
        sx={{ position: "fixed", bottom: 32, right: 32 }}
        open={expand}
        onClick={toggleSpeedDial}
        hidden={open}
      >
        {items.map((item, index) => (
          <SpeedDialAction
            key={index}
            icon={item.icon || <EditIcon />}
            tooltipTitle={item.label || ""}
            onClick={handleSelect(item.label, index)}
          />
        ))}
        {items.length ? null : (
          <SpeedDialAction
            icon={<BlockIcon />}
            tooltipTitle="No actions available"
            onClick={handleDrawerClose}
          />
        )}
      </SpeedDial>
      <Zoom in={open}>
        <Fab
          color="primary"
          onClick={handleDrawerClose}
          sx={{ position: "fixed", bottom: 32, right: 32 }}
        >
          <ChevronRightIcon />
        </Fab>
      </Zoom>
      <Slide direction="left" in={open} mountOnEnter unmountOnExit>
        <Card
          raised={true}
          sx={{
            position: "fixed",
            right: 32,
            maxHeight: "80%",
            overflow: "auto",
          }}
        >
          <CardHeader subheader={drawerTitle} />
          <Divider />
          <CardContent>
            <Stack spacing={1} divider={<Divider />}>
              {items[drawerIndex]?.description ? (
                <Typography
                  variant="caption"
                  sx={{ width: DIMENSIONS.BOX_WIDTH }}
                >
                  {items[drawerIndex].description}
                </Typography>
              ) : null}
              {children[drawerIndex] || "Nothing here."}
            </Stack>
          </CardContent>
        </Card>
      </Slide>
    </>
  );
}
