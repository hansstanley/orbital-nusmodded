// import logo from './logo.svg';
import "./App.css";
import React from "react";
import { ThemeProvider } from "@mui/material";
import { darkTheme, lightTheme } from "./themes";
import { NavFrame, Router } from "./components";
import { LightModeContext } from "./contexts";

function App() {
  /**	Handles toggling between light and dark modes. */
  const [lightMode, setLightMode] = React.useState(true);

  const toggleColorMode = React.useCallback(() => {
    setLightMode(!lightMode);
  }, [lightMode]);

  const colorMode = React.useMemo(
    () => ({
      isLightMode: lightMode,
      toggleLightMode: toggleColorMode,
    }),
    [lightMode, toggleColorMode]
  );

  return (
    <LightModeContext.Provider value={colorMode}>
      <ThemeProvider theme={lightMode ? lightTheme : darkTheme}>
        <NavFrame>
            <Router />
        </NavFrame>
      </ThemeProvider>
    </LightModeContext.Provider>
  );
}

export default App;
