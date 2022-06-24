import { plainToInstance } from "class-transformer";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useBackend, useSnackbar } from ".";
import { Mod, ModGroup } from "../models";

const ModGroupContext = createContext({
  loading: false,
  getModGroupArray: () => [],
  getModGroupMap: () => new Map(),
  getModGroup: (groupId) => new ModGroup(),
  getModGroupMods: async (groupId) => [],
  bindModGroupMods: async (groupId, { moduleCodes }) => [],
  unbindModGroupMods: async (groupId, { moduleCodes }) => 0,
  createModGroup: async (data) => new ModGroup(),
  updateModGroup: async (groupId, data) => new ModGroup(),
  deleteModGroup: async (groupId) => new ModGroup(),
});

function ModGroupProvider({ children }) {
  const { makeRequest } = useBackend();
  const { pushSnack } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [modGroupMap, setModGroupMap] = useState(new Map());

  useEffect(() => {
    async function buildModGroups() {
      setLoading(true);

      try {
        const { status, data } = await makeRequest({
          method: "get",
          route: "/module-group",
        });

        if (status === 200 && Array.isArray(data)) {
          const map = new Map();
          for (let raw of data) {
            const modGroup = plainToInstance(ModGroup, raw);
            map.set(modGroup.id, modGroup);
          }
          setModGroupMap(map);
        } else {
          throw new Error(`Error loading module groups with status ${status}`);
        }
      } catch (error) {
        console.error(error);
        pushSnack({
          message: error.message || "Error loading module groups",
          severity: "error",
        });
      } finally {
        setLoading(false);
        setRefresh(false);
      }
    }

    if (refresh) buildModGroups();
  }, [refresh, makeRequest, pushSnack]);

  const getModGroupArray = useCallback(
    () => Array.from(modGroupMap.values()),
    [modGroupMap]
  );

  const getModGroupMap = useCallback(() => modGroupMap, [modGroupMap]);

  const getModGroup = useCallback(
    (groupId) => modGroupMap.get(groupId),
    [modGroupMap]
  );

  const getModGroupMods = async (groupId) => {
    const { status, data } = await makeRequest({
      method: "get",
      route: `/module-group/${groupId}/modules`,
    });

    if (status === 200 && Array.isArray(data)) {
      return data.map((raw) => plainToInstance(Mod, raw));
    } else {
      throw new Error(`Unable to retrieve modules for module group ${groupId}`);
    }
  };

  const bindModGroupMods = async (groupId, { moduleCodes = [] }) => {
    const { status, data } = await makeRequest({
      method: "post",
      route: `/module-group/${groupId}/add-modules`,
      data: { moduleCodes },
      isPublic: false,
    });

    if (status === 200 && Array.isArray(data?.bound)) {
      const unbound = moduleCodes.filter((code) => !data.bound.includes(code));
      if (unbound.length) console.error("Unable to bind", unbound);
      return data.bound;
    } else {
      throw new Error(`Unable to bind modules to module group ${groupId}`);
    }
  };

  const unbindModGroupMods = async (groupId, { moduleCodes = [] }) => {
    const { status, data } = await makeRequest({
      method: "post",
      route: `/module-group/${groupId}/remove-modules`,
      data: { moduleCodes },
      isPublic: false,
    });

    if (status === 200 && data) {
      return data.count;
    } else {
      throw new Error(`Unable to unbind modules from module group ${groupId}`);
    }
  };

  const createModGroup = async ({
    name,
    description = null,
    minimum = null,
    maximum = null,
  }) => {
    const { status, data } = await makeRequest({
      method: "post",
      route: "/module-group/new",
      data: { name, description, minimum, maximum },
      isPublic: false,
    });

    if (status === 201 && data) {
      setRefresh(true);
      return plainToInstance(ModGroup, data);
    } else {
      throw new Error(`Unable to create module group ${name}`);
    }
  };

  const updateModGroup = async (
    groupId,
    { name, description, minimum, maximum }
  ) => {
    const params = {};
    if (name) params.name = name;
    if (description) params.description = description;
    if (minimum) params.minimum = minimum;
    if (maximum) params.maximum = maximum;

    const { status, data } = await makeRequest({
      method: "post",
      route: `/module-group/${groupId}/edit`,
      data: params,
      isPublic: false,
    });

    if (status === 200 && data) {
      setRefresh(true);
      return plainToInstance(ModGroup, data);
    } else {
      throw new Error(`Unable to update module group ${groupId}`);
    }
  };

  const deleteModGroup = async (groupId) => {
    const { status, data } = await makeRequest({
      method: "delete",
      route: `/module-group/${groupId}`,
      isPublic: false,
    });

    if (status === 200) {
      setRefresh(true);
      return plainToInstance(ModGroup, data);
    } else {
      throw new Error(`Unable to delete module group ${groupId}`);
    }
  };

  const values = {
    loading,
    getModGroupArray,
    getModGroupMap,
    getModGroup,
    getModGroupMods,
    bindModGroupMods,
    unbindModGroupMods,
    createModGroup,
    updateModGroup,
    deleteModGroup,
  };

  return (
    <ModGroupContext.Provider value={values}>
      {children}
    </ModGroupContext.Provider>
  );
}

function useModGroup() {
  const context = useContext(ModGroupContext);
  if (!(context ?? false)) {
    throw new Error("useModGroup must be used within an ModGroupProvider");
  }

  return context;
}

export { ModGroupProvider, useModGroup };
