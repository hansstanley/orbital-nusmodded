import { IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeContext } from "../../contexts";

export default function ColorModeButton() {
  return (
    <ThemeContext.Consumer>
      {({ colorMode, toggleColorMode }) => (
        <IconButton onClick={toggleColorMode} sx={{ ml: 1 }}>
          {colorMode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
      )}
    </ThemeContext.Consumer>
  );
}
