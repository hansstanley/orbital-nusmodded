import {
  Button,
  Box,
  Drawer,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  Paper,
  Card,
  Collapse,
  Slide,
  CardHeader,
  CardContent,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from "@mui/material";
import { useState } from "react";
import MuiAppBar from "@mui/material/AppBar";
import BlockIcon from "@mui/icons-material/Block";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from "@mui/icons-material/Edit";
import AddModules from "./AddModules";
import { ModuleStack as ModStack } from "../../components/Mod";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import RoadmapFab from "./RoadmapFab";
import { maxHeight } from "@mui/system";

const drawerWidth = 350;

export default function RightDrawer({
  items = [], // { icon, label, content }
  children,
  roadMap,
  handleAdd,
  handleDelete,
  loadingProfile,
  allMods,
}) {
  const [open, setOpen] = useState(false);
  const [drawerIndex, setDrawerIndex] = useState(0);
  const [drawerTitle, setDrawerTitle] = useState(null);

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
        sx={{ position: "absolute", bottom: 32, right: 32 }}
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
      <Slide direction="left" in={open} mountOnEnter unmountOnExit>
        <Card
          raised={true}
          sx={{
            position: "absolute",
            right: 32,
            maxHeight: "80%",
            overflow: "auto",
          }}
        >
          <CardHeader
            subheader={drawerTitle}
            action={
              <IconButton onClick={handleDrawerClose}>
                <ChevronRightIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            {children[drawerIndex] || "Nothing here."}
            {/* <Droppable droppableId={"-1"}>
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <AddModules
                    sx={{ zIndex: 2000 }}
                    roadMap={roadMap}
                    handleAdd={handleAdd}
                    loadingProfile={loadingProfile}
                    allMods={allMods}
                    handleDelete={handleDelete}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable> */}
          </CardContent>
        </Card>
      </Slide>
    </>
  );
}
