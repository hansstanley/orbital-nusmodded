import { CookiesProvider } from "react-cookie";

import { AuthSessionProvider } from "./auth-session.provider";
import { DrawerContextProvider } from "./drawer.provider";
import { SnackbarProvider } from "./snackbar.provider";
import { AppThemeProvider } from "./app-theme.provider";
import { BackendProvider } from "./backend.provider";
import { CourseProvider } from "./course.provider";
import { ModProvider } from "./mod.provider";
import { ModGroupProvider } from "./mod-group.provider";
import { RoadmapProvider } from "./roadmap.provider";
import { SettingsProvider } from "./settings.provider";

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
  AuthSessionProvider,
  BackendProvider,
  SettingsProvider,
  AppThemeProvider,
  CourseProvider,
  ModProvider,
  ModGroupProvider,
  DrawerContextProvider,
  RoadmapProvider,
];

export const AppContextProvider = combineComponents(...providers);
