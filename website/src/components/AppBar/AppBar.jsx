import {
  AppBar as MuiAppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";
import AppTitle from "./AppTitle";
import MenuIcon from "@mui/icons-material/Menu";
import ColorModeButton from "./ColorModeButton";
import { AuthSessionContext, LandingContext } from "../../contexts";
import LogoutDialog from "./LogoutDialog";

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
  const { signedIn } = useContext(AuthSessionContext);

  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogoutClose = () => {
    setLogoutOpen(false);
  };

  const handleLogoutOpen = () => {
    setLogoutOpen(true);
  };

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
      <LogoutDialog open={logoutOpen} handleClose={handleLogoutClose} />
      <Toolbar>
        <IconButton color="primary" edge="start" onClick={handleDrawerToggle}>
          <MenuIcon />
        </IconButton>
        <AppTitle />
        <Box sx={{ flex: 1 }} />
        {signedIn ? (
          <Button variant="outlined" onClick={handleLogoutOpen}>
            LOGOUT
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/login")}
          >
            LOGIN
          </Button>
        )}
        <ColorModeButton />
      </Toolbar>
    </AnimatedAppBar>
  );
}
