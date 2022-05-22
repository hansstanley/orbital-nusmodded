// import logo from './logo.svg';
import "./App.css";
import React from "react";
import { Paper } from "@mui/material";
import { Themer } from "./themes";
import { NavFrame, Router } from "./components";
import { ModuleInfoContext } from "./contexts";
import { ModuleService } from "./components/NusModule";

function App() {
  const [isModuleLoaded, setIsModuleLoaded] = React.useState(false);
  const [moduleList, setModuleList] = React.useState([]);
  // const moduleService = React.useMemo(() => new ModuleService(), []);

  React.useEffect(() => {
    const moduleService = new ModuleService();
    moduleService.buildModules().then(() => {
      setModuleList(moduleService.getModuleList());
      setIsModuleLoaded(true);
    });
  }, []);

  return (
    <ModuleInfoContext.Provider
      value={{ modules: moduleList, isLoaded: isModuleLoaded }}
    >
      <Themer>
        <NavFrame>
          <Paper elevation={5} sx={{ flexGrow: 1, p: 2 }}>
            <Router />
          </Paper>
        </NavFrame>
      </Themer>
    </ModuleInfoContext.Provider>
  );
}

export default App;
