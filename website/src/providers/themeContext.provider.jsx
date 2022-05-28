import { useState, useCallback, useMemo } from "react";
import { ThemeProvider } from "@mui/material";
import { defaultLightTheme, defaultDarkTheme } from "../themes";
import { ThemeContext } from "../contexts";
import { useCookies } from "react-cookie";

export default function ThemeContextProvider(props) {
  const { children } = props;

  const [cookies, setCookies] = useCookies(["colorMode", "colorTheme"]);

  const [colorMode, setColorMode] = useState(cookies.colorMode ?? "light");
  const [colorTheme, setColorTheme] = useState(cookies.colorTheme ?? "default");

  const toggleColorMode = useCallback(() => {
    const newColorMode = colorMode === "light" ? "dark" : "light";
    setColorMode(newColorMode);
    setCookies("colorMode", newColorMode, { path: "/" });
  }, [colorMode, setCookies]);

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
    <ThemeContext.Provider value={themeContext}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}
