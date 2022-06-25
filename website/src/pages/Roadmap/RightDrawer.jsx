import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
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
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddModules from "./AddModules";
import { ModuleStack as ModStack } from "../../components/Mod";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import RoadmapFab from "./RoadmapFab";
import { maxHeight } from "@mui/system";

const drawerWidth = 350;

export default function DrawerRight({
  roadMap,
  handleAdd,
  loadingProfile,
  allMods,
  handleDelete,
}) {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  {
    /* <Button sx = {{position: "absolute", top: '45%', right: "-1%", zIndex: 2000, transform: 'rotate(-90deg)', height: 50, width: 150}} >
  <Typography noWrap>Add modules</Typography>
</Button> */
  }

  return (
    // <Box sx={{ display: "flex" }}>
    //   {!open && <RoadmapFab onClick={handleDrawerOpen} />}
    //   <Drawer
    //     sx={{
    //       width: "auto",
    //       height: "auto",
    //       flexShrink: 0,
    //       "& .MuiDrawer-paper": {
    //         width: drawerWidth,
    //       },
    //     }}
    //     BackdropProps={{ invisible: true }}
    //     variant="persistent"
    //     anchor="right"
    //     open={open}
    //     onClose={handleDrawerClose}
    //   >
    <>
      <RoadmapFab onClick={handleDrawerOpen} hidden={open} />
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
            subheader="My modules"
            action={
              <IconButton onClick={handleDrawerClose}>
                <ChevronRightIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <Droppable droppableId={"-1"}>
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
            </Droppable>
          </CardContent>
        </Card>
      </Slide>
    </>
    //   </Drawer>
    // </Box>
  );
}
