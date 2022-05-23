import { createContext } from "react";

const ThemeContext = createContext({
  colorMode: "light",
  toggleColorMode: () => {},
  colorTheme: "default",
  setColorTheme: () => {},
});

export default ThemeContext;
