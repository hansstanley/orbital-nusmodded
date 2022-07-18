import { AppBar as MuiAppBar, Box, IconButton, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AppTitle from "./AppTitle";
import ColorModeButton from "./ColorModeButton";
import AuthButtonGroup from "../AuthButtonGroup";
import { useDrawer } from "../../providers";

/**
 * An application bar that goes into the navigation frame.
 *
 * @param {object} props Props from the parent container.
 * @returns An application bar.
 */
export default function AppBar() {
  const { drawerOpen, handleDrawerToggle } = useDrawer();

  return (
    <MuiAppBar
      position="fixed"
      color="background"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <MenuButton handleClick={handleDrawerToggle} />
        <AppTitle drawerOpen={drawerOpen} onClick={handleDrawerToggle} />
        <Box sx={{ flex: 1 }} />
        <AuthButtonGroup />
        <ColorModeButton />
      </Toolbar>
    </MuiAppBar>
  );
}

function MenuButton({ handleClick = () => {} }) {
  return (
    <IconButton color="primary" edge="start" onClick={handleClick}>
      <MenuIcon />
    </IconButton>
  );
}
