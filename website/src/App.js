// import logo from './logo.svg';
import "./App.css";
import React from "react";
import { ThemeProvider } from "@mui/material";
import { darkTheme, lightTheme } from "./themes";
import { Paper } from "@mui/material";
import { ThemeContextProvider } from "./providers";
import { NavFrame, Router } from "./components";
import { ModuleInfoProvider } from "./providers";

function App() {
  return (
    <ModuleInfoProvider>
      <ThemeContextProvider>
        <NavFrame>
            <Router />
        </NavFrame>
      </ThemeContextProvider>
    </ModuleInfoProvider>
  );
}

export default App;
