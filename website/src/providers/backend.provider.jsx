import axios from "axios";
import { useCallback, useContext, useMemo } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthSession } from "./auth-session.provider";
import { useSnackbar } from "./snackbar.provider";
import { BACKEND_DOMAIN } from "../utils/constants";

const BackendContext = createContext({
  makeRequest: async ({ method, route, data, params, isPublic = true }) => {
    const res = await axios.get(BACKEND_DOMAIN);
    return res;
  },
});

function BackendProvider({ children }) {
  const { accessToken, handleSignout } = useAuthSession();
  const { pushSnack } = useSnackbar();
  const navigate = useNavigate();

  const makeRequest = useCallback(
    async ({ method, route, data, params, isPublic = true }) => {
      if (!isPublic && !accessToken) {
        throw new Error("Sign in required for this backend request");
      }

      const res = await axios({
        url: route,
        method,
        baseURL: BACKEND_DOMAIN,
        headers: isPublic ? {} : { Authorization: `Bearer ${accessToken}` },
        data,
        params,
      });

      if (!isPublic && res.status === 401) {
        pushSnack({
          message: "Session expired, please login again",
          severity: "error",
        });
        handleSignout();
        navigate("/");
      }

      return res;
    },
    [accessToken, handleSignout, navigate, pushSnack]
  );

  const value = useMemo(() => ({ makeRequest }), [makeRequest]);

  return (
    <BackendContext.Provider value={value}>{children}</BackendContext.Provider>
  );
}

function useBackend() {
  const context = useContext(BackendContext);
  if (!(context ?? false)) {
    throw new Error("useBackend must be used within an BackendProvider");
  }

  return context;
}

export { BackendProvider, useBackend };
