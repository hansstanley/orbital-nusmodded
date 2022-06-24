import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Button,
  Box,
  Drawer,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  Paper,
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddModules from "./AddModules";
import { ModuleStack as ModStack } from "../../components/Mod";

const drawerWidth = 350;



export default function DrawerRight({roadMap, handleAdd}) {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      { !open &&
      <Button sx = {{position: "absolute", top: '45%', right: "-1%", zIndex: 2000, transform: 'rotate(-90deg)', height: 50, width: 150}} onClick={handleDrawerOpen}>
        <Typography noWrap>Add modules</Typography>
      </Button>
      }
      <Drawer
        sx={{
          width: "auto",
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        BackdropProps={{ invisible: true }}
        variant="persistent"
        anchor="right"
        open={open}
        onClose={handleDrawerClose}
        elevation = "0"
      >
        <Paper sx={{ p: 2, position: "sticky", top: 0, left: 0, zIndex: 3000, height: "100%"}} elevation = {8}>
          <IconButton onClick={handleDrawerClose} sx ={{p: 1, left: "-4%", top: "-1%"}}>
            <ChevronRightIcon />
          </IconButton>
        <Divider />
          <AddModules sx={{zIndex: 2000}} roadMap = {roadMap} handleAdd = {handleAdd}/>
        </Paper>
      </Drawer>
    </Box>
  );
}
