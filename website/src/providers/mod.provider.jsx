import { plainToInstance } from "class-transformer";
import { useContext, useState } from "react";
import { createContext } from "react";
import { Mod } from "../models";
import { useBackend } from "./backend.provider";

const ModContext = createContext({
  getModArray: async () => [],
  getModInfo: async (moduleCode) => new Mod(),
});

function ModProvider({ children }) {
  const { makeRequest } = useBackend();
  const [modMap, setModMap] = useState(new Map());
  const [modArray, setModArray] = useState([]);

  const getModArray = async () => {
    if (modArray.length !== 0) return modArray;

    const { status, data } = await makeRequest({
      method: "get",
      route: "/module",
    });

    if (status === 200 && Array.isArray(data)) {
      setModArray(data);
      return data;
    } else {
      throw new Error("Unable to retrieve modules");
    }
  };

  const getModInfo = async (moduleCode) => {
    if (modMap.has(moduleCode)) return modMap.get(moduleCode);

    const { status, data } = await makeRequest({
      method: "get",
      route: `/module/${moduleCode}`,
    });

    if (status === 200 && data) {
      const mod = plainToInstance(Mod, data);
      mod.preclusion = processPreclusion(mod.preclusion);

      setModMap((prev) => {
        prev.set(moduleCode, mod);
        return prev;
      });
      return mod;
    } else {
      throw new Error(`Unable to retrieve info for module ${moduleCode}`);
    }
  };

  const processPreclusion = (preclusion = "") => {
    if (!preclusion) return [];

    const moduleCodes = [
      ...preclusion.matchAll(/[A-Za-z]+[0-9]+[A-Za-z]*/g),
    ].map((match) => match[0]);
    return moduleCodes;
  };

  const values = {
    getModArray,
    getModInfo,
  };

  return <ModContext.Provider value={values}>{children}</ModContext.Provider>;
}

function useMod() {
  const context = useContext(ModContext);
  if (!(context ?? false)) {
    throw new Error("useMod must be used within an ModProvider");
  }

  return context;
}

export { ModProvider, useMod };
