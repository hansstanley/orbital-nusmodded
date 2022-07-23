import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  Divider,
  Stack,
  Typography,
  Zoom,
} from "@mui/material";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { LoadingBar } from "../../components";

export default function SettingsRow({
  title,
  loading = false,
  showSuccess = false,
  children,
}) {
  const [success, setSuccess] = useState({
    id: null,
    value: false,
  });

  useEffect(() => {
    if (showSuccess) {
      const id = v4();
      setSuccess({ id, value: true });
      setTimeout(() => {
        setSuccess((prev) => (prev.id === id ? { id, value: false } : prev));
      }, 3000);
    }
  }, [showSuccess]);

  useEffect(() => {
    if (loading) setSuccess(({ id, value }) => ({ id, value: false }));
  }, [loading]);

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
        <Collapse in={success.value} orientation="horizontal">
          <Alert severity="success">Saved!</Alert>
        </Collapse>
        <Zoom in={loading}>
          <CircularProgress />
        </Zoom>
      </Stack>
      <Stack display={{ sm: "none", xs: "flow" }} spacing={1} width="100%">
        <Typography variant="h6">{title}</Typography>
        <Box>{children}</Box>
        <Collapse in={success.value}>
          <Alert severity="success">Saved!</Alert>
        </Collapse>
        <LoadingBar loading={loading} isRounded />
      </Stack>
    </>
  );
}
