import React from "react";
import { ThemeProvider } from "@mui/material";
import { defaultLightTheme, defaultDarkTheme } from "../themes";
import { ThemeContext } from "../contexts";

export default function ThemeContextProvider(props) {
  const { children } = props;

  const [colorMode, setColorMode] = React.useState("light");
  const [colorTheme, setColorTheme] = React.useState("default");

  const toggleColorMode = React.useCallback(() => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  }, [colorMode]);

  const theme = React.useMemo(() => {
    switch (colorTheme) {
      default:
        return colorMode === "light" ? defaultLightTheme : defaultDarkTheme;
    }
  }, [colorMode, colorTheme]);

  const themeContext = React.useMemo(
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
      <ThemeProvider theme={theme}>{children}</ThemeProvider>;
    </ThemeContext.Provider>
  );
}
