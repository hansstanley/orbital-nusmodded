import { useMemo } from "react";
import { IconButton, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useAppTheme } from "../../providers";
import { animated, useSpring } from "@react-spring/web";

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

  const { x } = useSpring({
    from: { x: 0 },
    x: colorMode === "light" ? 1 : 0,
    config: { duration: 1000 },
  });

  const AnimatedIconButton = animated(IconButton);

  return (
    <Tooltip title={tooltipText}>
      <AnimatedIconButton
        onClick={toggleColorMode}
        sx={{ ml: 1 }}
        style={{
          scale: x.to({
            range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
            output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1],
          }),
        }}
      >
        {colorMode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
      </AnimatedIconButton>
    </Tooltip>
  );
}
