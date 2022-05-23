import { useEffect, useState } from "react";
import { ModuleInfoContext } from "../../contexts";
import ModuleService from "./module.service";

export default function ModuleInfoProvider(props) {
  const { children } = props;
  const [isModuleLoaded, setIsModuleLoaded] = useState(false);
  const [moduleList, setModuleList] = useState([]);

  useEffect(() => {
    const moduleService = new ModuleService();
    moduleService.buildModules().then(() => {
      setModuleList(moduleService.getModuleList());
      setIsModuleLoaded(true);
    });
  }, []);

  return (
    <ModuleInfoContext.Provider
      value={{
        modules: moduleList,
        isLoaded: isModuleLoaded,
      }}
    >
      {children}
    </ModuleInfoContext.Provider>
  );
}
