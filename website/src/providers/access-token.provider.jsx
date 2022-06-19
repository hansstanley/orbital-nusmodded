import { useCallback, useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const AccessTokenContext = createContext({
  hasAccess: false,
  accessToken: undefined,
  setAccessToken: (newAccessToken) => {},
});

function AccessTokenProvider({ children }) {
  const [hasAccess, setHasAccess] = useState(false);
  const [accessToken, setAccessToken] = useState(undefined);

  const setToken = useCallback((newAccessToken) => {
    setHasAccess(true);
    setAccessToken(newAccessToken);
  }, []);

  return (
    <AccessTokenContext.Provider
      value={{
        hasAccess,
        accessToken,
        setAccessToken: setToken,
      }}
    >
      {children}
    </AccessTokenContext.Provider>
  );
}

function useAccessToken() {
  const context = useContext(AccessTokenContext);
  if (!(context ?? false)) {
    throw new Error(
      "useAccessToken must be used within an AccessTokenProvider"
    );
  }

  return context;
}

export { AccessTokenProvider, useAccessToken };
