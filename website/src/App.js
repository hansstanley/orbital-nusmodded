// import logo from './logo.svg';
import "./App.css";
import React from "react";
import { Paper } from "@mui/material";
import { Themer } from "./themes";
import { NavFrame, Router } from "./components";

function App() {
  return (
    <Themer>
      <NavFrame>
        <Paper elevation={5} sx={{ flexGrow: 1, p: 2 }}>
          <Router />
        </Paper>
      </NavFrame>
    </Themer>
  );
}

export default App;
