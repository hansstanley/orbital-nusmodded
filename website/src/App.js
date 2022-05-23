// import logo from './logo.svg';
import "./App.css";
import React from "react";
import { Paper } from "@mui/material";
import { Themer } from "./themes";
import { NavFrame, Router } from "./components";
import { ModuleInfoProvider } from "./components/NusModule";

function App() {
  return (
    <ModuleInfoProvider>
      <Themer>
        <NavFrame>
          <Paper elevation={5} sx={{ flexGrow: 1, p: 2 }}>
            <Router />
          </Paper>
        </NavFrame>
      </Themer>
    </ModuleInfoProvider>
  );
}

export default App;
