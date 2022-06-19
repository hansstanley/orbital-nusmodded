import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const AccessTokenContext = createContext({
  accessToken: undefined,
  setAccessToken: (newAccessToken) => {},
});

function AccessTokenProvider({ children }) {
  const [accessToken, setAccessToken] = useState(undefined);

  return (
    <AccessTokenContext.Provider
      value={{
        accessToken,
        setAccessToken,
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
