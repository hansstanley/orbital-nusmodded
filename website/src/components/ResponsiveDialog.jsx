import { Box, Dialog, useMediaQuery, useTheme } from "@mui/material";

/**
 * Dialog that becomes fullscreen when the screen size is below sm.
 *
 * @param {object} props
 * @returns A responsive dialog.
 */
export default function ResponsiveDialog({
  open = false,
  onClose = () => {},
  component = null,
  children,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen}>
      <Box component={component}>{children}</Box>
    </Dialog>
  );
}
