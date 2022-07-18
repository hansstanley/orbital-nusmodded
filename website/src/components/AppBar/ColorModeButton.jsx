import { IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useAppTheme } from "../../providers";

/**
 * Button to toggle between light and dark colour modes.
 *
 * @returns An icon button.
 */
export default function ColorModeButton() {
  const { colorMode, toggleColorMode } = useAppTheme();

  return (
    <IconButton onClick={toggleColorMode} sx={{ ml: 1 }}>
      {colorMode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
    </IconButton>
  );
}
