// import logo from './logo.svg';
import "./App.css";
import React from "react";
import { CookiesProvider } from "react-cookie";
import { ThemeContextProvider } from "./providers";
import { NavFrame, Router } from "./components";
import { ModuleInfoProvider } from "./providers";
import LandingProvider from "./providers/landing.provider";

function App() {
  return (
    <ModuleInfoProvider>
      <ThemeContextProvider>
        <CookiesProvider>
          <LandingProvider>
            <NavFrame>
              <Router />
            </NavFrame>
          </LandingProvider>
        </CookiesProvider>
      </ThemeContextProvider>
    </ModuleInfoProvider>
  );
}

export default App;
