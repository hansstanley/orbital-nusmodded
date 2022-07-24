import { useMemo } from "react";
import { IconButton, Tooltip } from "@mui/material";
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

  const tooltipText = useMemo(
    () =>
      colorMode === "light" ? "Switch to dark theme" : "Switch to light theme",
    [colorMode]
  );

  return (
    <Tooltip title={tooltipText}>
      <IconButton onClick={toggleColorMode} sx={{ ml: 1 }}>
        {colorMode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </Tooltip>
  );
}
