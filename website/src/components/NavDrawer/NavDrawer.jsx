import { useContext } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";
import { pages } from "../../pages";
import { LandingContext } from "../../contexts";

const AnimatedDrawer = animated(Drawer);

/**
 * A navigation drawer that goes into the navigation frame.
 * @param {object} props Props from the parent container.
 * @returns A navigation drawer.
 */
export default function NavDrawer(props) {
  const { drawerWidth, mobileOpen, handleDrawerToggle } = props;

  const navigate = useNavigate();
  const { isLanding } = useContext(LandingContext);
  const { drawerX } = useSpring({
    drawerX: isLanding ? -drawerWidth : 0,
  });

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Toolbar />
      <List>
        {pages.map((page) => {
          if (page.isDrawerAccessory) {
            return page.content;
          } else if (page.isDrawerItem) {
            return (
              <ListItem key={page.key} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(page.path);
                    handleDrawerToggle();
                  }}
                >
                  <ListItemIcon>{page.icon}</ListItemIcon>
                  <ListItemText primary={page.title} />
                </ListItemButton>
              </ListItem>
            );
          }
          return null;
        })}
      </List>
    </Box>
  );

  return (
    <AnimatedDrawer
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      style={{ x: drawerX }}
    >
      {drawer}
    </AnimatedDrawer>
  );

  // return (
  //   <>
  //     <Drawer
  //       variant="temporary"
  //       open={mobileOpen}
  //       onClose={handleDrawerToggle}
  //       ModalProps={{ keepMounted: true }}
  //       sx={{
  //         display: { xs: "block", sm: "none" },
  //         width: drawerWidth,
  //         [`& .MuiDrawer-paper`]: {
  //           width: drawerWidth,
  //           boxSizing: "border-box",
  //         },
  //       }}
  //     >
  //       {drawer}
  //     </Drawer>
  //     <AnimatedDrawer
  //       variant="permanent"
  //       ModalProps={{ keepMounted: true }}
  //       sx={{
  //         display: { xs: "none", sm: "block" },
  //         width: drawerWidth,
  //         [`& .MuiDrawer-paper`]: {
  //           width: drawerWidth,
  //           boxSizing: "border-box",
  //         },
  //       }}
  //       style={{ x: drawerX }}
  //     >
  //       {drawer}
  //     </AnimatedDrawer>
  //   </>
  // );
}
