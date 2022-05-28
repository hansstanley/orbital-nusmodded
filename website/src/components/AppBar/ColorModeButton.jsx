import { IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeContext } from "../../contexts";
import { useContext } from "react";

export default function ColorModeButton() {
  const { colorMode, toggleColorMode } = useContext(ThemeContext);

  return (
    <IconButton onClick={toggleColorMode} sx={{ ml: 1 }}>
      {colorMode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
    </IconButton>
  );
}
