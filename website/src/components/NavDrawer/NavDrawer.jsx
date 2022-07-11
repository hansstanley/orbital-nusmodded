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
import { useDrawer } from "../../providers";

/**
 * A navigation drawer that goes into the navigation frame.
 * @param {object} props Props from the parent container.
 * @returns A navigation drawer.
 */
export default function NavDrawer({ drawerWidth }) {
  const navigate = useNavigate();
  const { drawerOpen, handleDrawerToggle } = useDrawer();

  const handlePage = (page) => {
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
    } else {
      return null;
    }
  };

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Toolbar />
      <List>{pages.map(handlePage)}</List>
    </Box>
  );

  return (
    <Drawer variant="temporary" open={drawerOpen} onClose={handleDrawerToggle}>
      {drawer}
    </Drawer>
  );
}
