import { AppBar as MuiAppBar, Box, IconButton, Toolbar, Stack } from "@mui/material";
import React, { useContext } from "react";
import { useSpring, animated } from "@react-spring/web";
import AppTitle from "./AppTitle";
import MenuIcon from "@mui/icons-material/Menu";
import ColorModeButton from "./ColorModeButton";
import { DrawerContext, LandingContext } from "../../contexts";
import LoginButton from "./LoginButton";
import SignUpButton from "./SignUpButton";

const AnimatedAppBar = animated(MuiAppBar);

// /**
//  * An application bar that goes into the navigation frame.
//  *
//  * @param {object} props Props from the parent container.
//  * @returns An application bar.
//  */
// export default function AppBar() {
//   const { handleDrawerToggle } = useContext(DrawerContext);
//   const { isLanding } = useContext(LandingContext);

//   const { barY } = useSpring({
//     barY: isLanding ? -64 : 0,
//   });

//   return (
//     <AnimatedAppBar
//       position="fixed"
//       color="background"
//       sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
//       style={{ y: barY }}
//     >
//       <Toolbar>
//         <IconButton color="primary" edge="start" onClick={handleDrawerToggle}>
//           <MenuIcon />
//         </IconButton>
//         <AppTitle />
//         <Box sx={{ flex: 1 }} />
//         <LoginButton />
//         <ColorModeButton />
//       </Toolbar>
//     </AnimatedAppBar>
//   );
// }

export default function AppBar() {
  const { handleDrawerToggle } = useContext(DrawerContext);

  return (
    <MuiAppBar
      position="fixed"
      color="background"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton color="primary" edge="start" onClick={handleDrawerToggle}>
          <MenuIcon />
        </IconButton>
        <AppTitle />
        <Box sx={{ flex: 1 }} />
        <Stack direction = "row" spacing = {1}>
          <LoginButton />
          <SignUpButton />
        </Stack>
        <ColorModeButton />
      </Toolbar>
    </MuiAppBar>
  );
}
