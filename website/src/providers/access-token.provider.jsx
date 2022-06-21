import {
  createContext,
  useCallback,
  useEffect,
  useContext,
  useState,
} from "react";
import { useCookies } from "react-cookie";

const AccessTokenContext = createContext({
  accessToken: undefined,
  hasAccess: false,
  setAccessToken: (newAccessToken) => {},
  clearAccessToken: () => {},
});

function AccessTokenProvider({ children }) {
  const [cookies, setCookies, removeCookies] = useCookies(["accessToken"]);
  const [accessToken, setAccessToken] = useState(undefined);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (cookies.accessToken) {
      setAccessToken(cookies.accessToken);
      setHasAccess(true);
    }
  }, [cookies.accessToken]);

  const setToken = useCallback(
    (newAccessToken) => {
      setAccessToken(newAccessToken);
      setCookies("accessToken", newAccessToken);
      setHasAccess(true);
    },
    [setCookies]
  );

  const clearToken = useCallback(() => {
    setAccessToken(undefined);
    removeCookies("accessToken");
    setHasAccess(false);
  }, [removeCookies]);

  return (
    <AccessTokenContext.Provider
      value={{
        accessToken,
        hasAccess,
        setAccessToken: setToken,
        clearAccessToken: clearToken,
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
