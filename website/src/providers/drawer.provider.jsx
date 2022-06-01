import { useState } from "react";
import { DrawerContext } from "../contexts";

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
