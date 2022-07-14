import { createContext, useContext, useEffect, useState } from "react";
import { SETTINGS } from "../utils/constants";
import { useAuthSession } from "./auth-session.provider";
import { useBackend } from "./backend.provider";
import { useSnackbar } from "./snackbar.provider";

const SettingsContext = createContext({
  loading: false,
  getSetting: (key) => {},
  setCourseId: async (courseId) => {},
  setMCLimit: async (mc) => {},
});

function SettingsProvider({ children }) {
  const { isAuth } = useAuthSession();
  const { makeRequest } = useBackend();
  const { pushSnack } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(true);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const { status, data } = await makeRequest({
          method: "get",
          route: "/user-settings",
          isPublic: false,
        });

        if (status === 200 && data) {
          setSettings(data);
          setUpdated(false);
        } else {
          throw new Error("Unable to retrieve user settings");
        }
      } catch (error) {
        console.error(error);
        pushSnack({
          message: "Unable to retrieve user settings",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    if (isAuth() && updated) loadSettings();
  }, [updated, isAuth, makeRequest, pushSnack]);

  const getSetting = (key) => settings[key];

  const setCourseId = async (courseId) => {
    const { status } = await makeRequest({
      method: "post",
      route: "/user-settings/edit",
      data: { key: SETTINGS.COURSE.ID, value: courseId },
      isPublic: false,
    });

    if (status !== 200) {
      throw new Error(`Unable to save course ${courseId}`);
    }

    setUpdated(true);
  };

  const setMCLimit = async (mc) => {
    const { status } = await makeRequest({
      method: "post",
      route: "/user-settings/edit",
      data: { key: SETTINGS.MC_LIMIT.ID, value: mc },
      isPublic: false,
    });

    if (status !== 200) {
      throw new Error(`Unable to set MC limit as ${mc}`);
    }

    setUpdated(true);
  };

  const setExemptedModules = async (moduleCodes) => {
    const { status } = await makeRequest({
      method: "post",
      route: "/user-settings/edit",
      data: { key: SETTINGS.EXEMPTED_MODULES, value: moduleCodes },
      isPublic: false,
    });

    if (status === 200) {
      setExemptedModules(moduleCodes);
    } else {
      throw new Error("Unable to save exempted modules");
    }
  }

  const values = { loading, getSetting, setCourseId, setMCLimit, setExemptedModules };

  return (
    <SettingsContext.Provider value={values}>
      {children}
    </SettingsContext.Provider>
  );
}

function useSettings() {
  const context = useContext(SettingsContext);
  if (!(context ?? false)) {
    throw new Error("useSettings must be used within an SettingsProvider");
  }

  return context;
}

export { SettingsProvider, useSettings };
