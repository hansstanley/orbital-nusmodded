import axios from "axios";
import { useContext } from "react";
import { createContext } from "react";
import { useAccessToken } from "./access-token.provider";

const BACKEND_DOMAIN = "https://nusmodded.herokuapp.com";

const BackendContext = createContext({
  makeRequest: async ({ method, route, data, params, isPublic = true }) => {
    const res = await axios.get(BACKEND_DOMAIN);
    return res;
  },
});

function BackendProvider({ children }) {
  const { accessToken } = useAccessToken();

  const makeRequest = async ({
    method,
    route,
    data,
    params,
    isPublic = true,
  }) => {
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

    return res;
  };

  return (
    <BackendContext.Provider value={{ makeRequest }}>
      {children}
    </BackendContext.Provider>
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
