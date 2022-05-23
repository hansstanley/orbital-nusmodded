// import logo from './logo.svg';
import "./App.css";
import React from "react";
import { Paper } from "@mui/material";
import { ThemeContextProvider } from "./providers";
import { NavFrame, Router } from "./components";
import { ModuleInfoProvider } from "./providers";

function App() {
  return (
    <ModuleInfoProvider>
      <ThemeContextProvider>
        <NavFrame>
          <Paper elevation={5} sx={{ flexGrow: 1, p: 2 }}>
            <Router />
          </Paper>
        </NavFrame>
      </ThemeContextProvider>
    </ModuleInfoProvider>
  );
}

export default App;
