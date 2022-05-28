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
import { pages } from "../../pages";
import { DrawerContext } from "../../contexts";

/**
 * A navigation drawer that goes into the navigation frame.
 * @param {object} props Props from the parent container.
 * @returns A navigation drawer.
 */
export default function NavDrawer({ drawerWidth }) {
  const navigate = useNavigate();
  const { drawerOpen, handleDrawerToggle } = useContext(DrawerContext);

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
    <Drawer variant="temporary" open={drawerOpen} onClose={handleDrawerToggle}>
      {drawer}
    </Drawer>
  );
}
