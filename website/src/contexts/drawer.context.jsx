import { createContext } from "react";

const DrawerContext = createContext(() => ({
  drawerOpen: false,
  handleDrawerToggle: () => {},
}));

export default DrawerContext;
