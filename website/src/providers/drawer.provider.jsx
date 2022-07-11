import { createContext, useContext, useState } from "react";

const DrawerContext = createContext({
  drawerOpen: false,
  handleDrawerToggle: () => {},
});

export default function DrawerContextProvider({ children }) {
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <DrawerContext.Provider
      value={{
        drawerOpen: open,
        handleDrawerToggle: handleDrawerToggle,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

function useDrawer() {
  const context = useContext(DrawerContext);
  if (!(context ?? false)) {
    throw new Error("useDrawer must be used within an DrawerContextProvider");
  }

  return context;
}

export { DrawerContextProvider, useDrawer };
