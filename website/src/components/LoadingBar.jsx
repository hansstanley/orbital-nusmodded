import { LinearProgress } from "@mui/material";
import { useMemo } from "react";

export default function LoadingBar({
  loading = false,
  isDeterminate = false,
  isRounded = false,
  value = 50,
}) {
  const sx = useMemo(() => {
    const res = {};

    if (isRounded) res.borderRadius = 1;

    return res;
  }, [isRounded]);

  if (loading) {
    if (isDeterminate) {
      return <LinearProgress variant="determinate" value={value} sx={sx} />;
    } else {
      return <LinearProgress sx={sx} />;
    }
  } else {
    return <LinearProgress variant="determinate" value={100} sx={sx} />;
  }
}
