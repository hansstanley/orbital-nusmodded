import { useEffect, useState } from "react";
import { ModuleInfoContext } from "../contexts";
import { ModuleInfoService } from "../services/moduleInfo";

/**
 * Provider for the ModuleInfoContext, which stores
 * a list of detailed module information and
 * whether it has been loaded.
 * @param {object} props Props from the parent component.
 * @returns A provider for ModuleInfoContext.
 */
export default function ModuleInfoProvider(props) {
  const { children } = props;
  const [moduleInfoService, setModuleInfoService] = useState(
    new ModuleInfoService()
  );
  const [isModuleLoaded, setIsModuleLoaded] = useState(false);
  const [moduleList, setModuleList] = useState([]);
  const [moduleMap, setModuleMap] = useState(new Map());

  useEffect(() => {
    const foo = async () => {
      const loadedService = await moduleInfoService.buildModules();
      setModuleInfoService(loadedService);
      setModuleList(moduleInfoService.getModuleList());
      setModuleMap(moduleInfoService.getModuleMap());
      setIsModuleLoaded(true);
    };
    foo();
  }, [moduleInfoService]);

  return (
    <ModuleInfoContext.Provider
      value={{
        moduleMap: moduleMap,
        modules: moduleList,
        isLoaded: isModuleLoaded,
      }}
    >
      {children}
    </ModuleInfoContext.Provider>
  );
}
