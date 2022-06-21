import { CookiesProvider } from "react-cookie";

import { AuthSessionProvider } from "./auth-session.provider";
import DrawerContextProvider from "./drawer.provider";
import LandingProvider from "./landing.provider";
import ModuleInfoProvider from "./moduleInfo.provider";
import { SnackbarProvider } from "./snackbar.provider";
import ThemeContextProvider from "./themeContext.provider";
import CourseInfoProvider from "./courseInfo.provider";
import { AccessTokenProvider } from "./access-token.provider";
import { BackendProvider } from "./backend.provider";
import { CourseProvider } from "./course.provider";
import { ModProvider } from "./mod.provider";

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
  SnackbarProvider,
  AccessTokenProvider,
  BackendProvider,
  AuthSessionProvider,
  ThemeContextProvider,
  CourseProvider,
  ModProvider,
  ModuleInfoProvider,
  LandingProvider,
  DrawerContextProvider,
  CourseInfoProvider,
];

export const AppContextProvider = combineComponents(...providers);
