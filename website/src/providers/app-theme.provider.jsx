import {
  useState,
  useCallback,
  useMemo,
  createContext,
  useEffect,
  useContext,
} from "react";
import { ThemeProvider } from "@mui/material";
import { defaultLightTheme, defaultDarkTheme } from "../themes";
import { useCookies } from "react-cookie";

const AppThemeContext = createContext({
  colorMode: "light",
  toggleColorMode: () => {},
  colorTheme: "default",
  setColorTheme: (theme) => {},
});

function AppThemeProvider({ children }) {
  const [cookies, setCookies] = useCookies(["colorMode", "colorTheme"]);

  const [colorMode, setColorMode] = useState(cookies.colorMode ?? "light");
  const [colorTheme, setColorTheme] = useState(cookies.colorTheme ?? "default");

  useEffect(() => {
    setCookies("colorMode", colorMode, { path: "/" });
  }, [colorMode, setCookies]);

  const toggleColorMode = useCallback(
    () => setColorMode((prev) => (prev === "light" ? "dark" : "light")),
    []
  );

  const theme = useMemo(() => {
    switch (colorTheme) {
      default:
        return colorMode === "light" ? defaultLightTheme : defaultDarkTheme;
    }
  }, [colorMode, colorTheme]);

  const themeContext = useMemo(
    () => ({
      colorMode: colorMode,
      toggleColorMode: toggleColorMode,
      colorTheme: colorTheme,
      setColorTheme: setColorTheme,
    }),
    [colorMode, colorTheme, toggleColorMode]
  );

  return (
    <AppThemeContext.Provider value={themeContext}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppThemeContext.Provider>
  );
}

function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!(context ?? false)) {
    throw new Error("useAppTheme must be used within an ThemeProvider");
  }

  return context;
}

export { AppThemeProvider, useAppTheme };
