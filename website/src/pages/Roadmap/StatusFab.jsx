import { useEffect, useState } from "react";
import { Fab } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ErrorIcon from "@mui/icons-material/Error";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const statuses = {
  success: { icon: <DoneIcon /> },
  warning: { icon: <WarningAmberIcon /> },
  error: { icon: <ErrorIcon /> },
};

export default function StatusFab() {
  const [status, setStatus] = useState("success");
  const [appear, setAppear] = useState(true);

  useEffect(() => {}, [status]);

  return (
    <Fab
      color={status}
      onClick={() =>
        setStatus((prev) => {
          switch (prev) {
            case "success":
              return "warning";
            case "warning":
              return "error";
            case "error":
              return "success";
            default:
              return "success";
          }
        })
      }
      sx={{ position: "absolute", bottom: 32, right: 104 }}
    >
      {statuses[status].icon}
    </Fab>
  );
}
