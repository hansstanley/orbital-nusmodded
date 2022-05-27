import {
  AppBar as MuiAppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
} from "@mui/material";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";
import AppTitle from "./AppTitle";
import MenuIcon from "@mui/icons-material/Menu";
import ColorModeButton from "./ColorModeButton";
import { LandingContext } from "../../contexts";

const AnimatedAppBar = animated(MuiAppBar);

/**
 * An application bar that goes into the navigation frame.
 *
 * @param {object} props Props from the parent container.
 * @returns An application bar.
 */
export default function AppBar(props) {
  const { handleDrawerToggle } = props;

  const navigate = useNavigate();

  const { isLanding } = useContext(LandingContext);

  const { barY } = useSpring({
    barY: isLanding ? -64 : 0,
  });

  return (
    <AnimatedAppBar
      position="fixed"
      color="background"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      style={{ y: barY }}
    >
      <Toolbar>
        <IconButton color="primary" edge="start" onClick={handleDrawerToggle}>
          <MenuIcon />
        </IconButton>
        <AppTitle />
        <Box sx={{ flex: 1 }} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}
        >
          LOGIN
        </Button>
        <ColorModeButton />
      </Toolbar>
    </AnimatedAppBar>
  );
}
