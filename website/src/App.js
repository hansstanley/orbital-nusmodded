// import logo from './logo.svg';
import "./App.css";
import React from "react";
import { CookiesProvider } from "react-cookie";
import { ThemeContextProvider } from "./providers";
import { NavFrame, Router } from "./components";
import { ModuleInfoProvider } from "./providers";

function App() {
  return (
    <ModuleInfoProvider>
      <ThemeContextProvider>
        <CookiesProvider>
          <NavFrame>
            <Router />
          </NavFrame>
        </CookiesProvider>
      </ThemeContextProvider>
    </ModuleInfoProvider>
  );
}

export default App;
