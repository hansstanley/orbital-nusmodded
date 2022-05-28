import { CookiesProvider } from "react-cookie";
import AuthSessionProvider from "./authSession.provider";
import DrawerContextProvider from "./drawer.provider";
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
  CookiesProvider,
  AuthSessionProvider,
  ThemeContextProvider,
  ModuleInfoProvider,
  LandingProvider,
  DrawerContextProvider,
];

export const AppContextProvider = combineComponents(...providers);
