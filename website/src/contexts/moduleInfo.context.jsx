import { createContext } from "react";

const ModuleInfoContext = createContext(() => ({
  modules: [],
  isLoaded: false,
}));

export default ModuleInfoContext;
