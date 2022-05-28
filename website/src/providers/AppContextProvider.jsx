import { CookiesProvider } from "react-cookie";
import AuthSessionProvider from "./authSession.provider";
import LandingProvider from "./landing.provider";
import ModuleInfoProvider from "./moduleInfo.provider";
import ThemeContextProvider from "./themeContext.provider";

function combineComponents(...components) {
  return components.reduce(
    (Accumulated, Current) =>
      ({ children }) =>
        (
          <Accumulated>
            <Current>{children}</Current>
          </Accumulated>
        ),
    ({ children }) => <>{children}</>
  );
}

const providers = [
  AuthSessionProvider,
  CookiesProvider,
  ThemeContextProvider,
  ModuleInfoProvider,
  LandingProvider,
];

export const AppContextProvider = combineComponents(...providers);
