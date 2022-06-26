import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  Divider,
  LinearProgress,
  Stack,
  Typography,
  Zoom,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function SettingsRow({
  title,
  loading = false,
  showSuccess = false,
  children,
}) {
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  }, [showSuccess]);

  return (
    <>
      <Stack
        display={{ sm: "flex", xs: "none" }}
        flexShrink={1}
        spacing={2}
        direction="row"
        alignItems="center"
        width="100%"
      >
        <Typography variant="h6" width={240}>
          {title}
        </Typography>
        <Divider orientation="vertical" />
        {children}
        <Collapse in={success} orientation="horizontal">
          <Alert severity="success">Saved!</Alert>
        </Collapse>
        <Zoom in={loading}>
          <CircularProgress />
        </Zoom>
      </Stack>
      <Stack display={{ sm: "none", xs: "flow" }} spacing={1} width="100%">
        <Typography variant="h6">{title}</Typography>
        <Box>{children}</Box>
        <Collapse in={success}>
          <Alert severity="success">Saved!</Alert>
        </Collapse>
        {loading ? (
          <LinearProgress />
        ) : (
          <LinearProgress
            variant="determinate"
            value={100}
            sx={{ borderRadius: 1 }}
          />
        )}
      </Stack>
    </>
  );
}
