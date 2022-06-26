import React from "react";
import { Box, CssBaseline } from "@mui/material";
import AppBar from "./AppBar";
import NavDrawer from "./NavDrawer";
import MainFrame from "./MainFrame";

const DRAWER_WIDTH = 240;

/**
 * A navigation frame that contains the app bar, navigation drawer,
 * and main content.
 *
 * @param {object} props Props from the parent container.
 * @returns A navigation frame.
 */
export default function NavFrame(props) {
  const { children } = props;

  /** Handles opening and closing of the navigation drawer. */
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }} bgcolor="background.paper">
      <CssBaseline />
      <AppBar handleDrawerToggle={handleDrawerToggle} />
      <NavDrawer
        drawerWidth={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <MainFrame>{children}</MainFrame>
    </Box>
  );
}
