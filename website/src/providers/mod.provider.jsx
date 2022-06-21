import { plainToInstance } from "class-transformer";
import { useContext } from "react";
import { createContext } from "react";
import { Mod } from "../models";
import { useBackend } from "./backend.provider";

const ModContext = createContext({
  getModArray: async () => [],
  getModInfo: async (moduleCode) => new Mod(),
});

function ModProvider({ children }) {
  const { makeRequest } = useBackend();

  const getModArray = async () => {
    const { status, data } = await makeRequest({
      method: "get",
      route: "/module",
    });

    if (status === 200 && Array.isArray(data)) {
      return data;
    } else {
      throw new Error("Unable to retrieve modules");
    }
  };

  const getModInfo = async (moduleCode) => {
    const { status, data } = await makeRequest({
      method: "get",
      route: `/module/${moduleCode}`,
    });

    if (status === 200 && data) {
      return plainToInstance(Mod, data);
    } else {
      throw new Error(`Unable to retrieve info for module ${moduleCode}`);
    }
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
