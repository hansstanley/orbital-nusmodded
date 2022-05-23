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
  const [isModuleLoaded, setIsModuleLoaded] = useState(false);
  const [moduleList, setModuleList] = useState([]);

  useEffect(() => {
    const foo = async () => {
      const moduleInfoService = await new ModuleInfoService().buildModules();
      setModuleList(moduleInfoService.getModuleList());
      setIsModuleLoaded(true);
    };
    foo();
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
