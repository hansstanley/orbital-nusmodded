import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Fab,
  Stack,
  Typography,
  Zoom,
} from "@mui/material";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useRoadmap } from "../../providers";

const statuses = {
  success: { icon: <DoneRoundedIcon /> },
  warning: { icon: <WarningAmberRoundedIcon /> },
  error: { icon: <ErrorOutlineRoundedIcon /> },
};

export default function StatusFab() {
  const { loading, getIssues } = useRoadmap();
  const [status, setStatus] = useState("success");
  const [open, setOpen] = useState(false);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    if (loading) return;

    getIssues().then((newIssues) => setIssues(newIssues));
  }, [loading, getIssues]);

  useEffect(() => {
    setStatus(
      issues.reduce((prev, curr) => {
        if (curr?.severity === "warning" && prev !== "error") {
          return "warning";
        } else {
          return "error";
        }
      }, "success")
    );
  }, [issues]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleIssue = (issue, index) => {
    if (typeof issue === "string") {
      return (
        <Alert key={index} severity="error">
          {issue}
        </Alert>
      );
    } else {
      return (
        <Alert key={index} severity={issue?.severity || "error"}>
          {issue?.message || `${issue}`}
        </Alert>
      );
    }
  };

  return (
    <>
      <Zoom in={!open}>
        <Fab
          color={status}
          onClick={handleOpen}
          sx={{ position: "absolute", bottom: 32, right: 104 }}
        >
          {statuses[status].icon}
        </Fab>
      </Zoom>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Stack spacing={1}>
            {issues.map(handleIssue)}
            {issues.length === 0 ? (
              <Typography variant="h6">No issues found.</Typography>
            ) : null}
            <Divider />
            <Stack>
              <Typography variant="caption">
                Note: This checker only shows issues of the following:
              </Typography>
              {[
                "When the number of MCs from the modules in a semester exceeds the MC limit set by the user",
                "When certain modules do not have their prerequisites fulfilled",
                "When modules are preclusions of each other in the same semester",
              ].map((bulletPoint, index) => (
                <Typography key={index} variant="caption">
                  • {bulletPoint}
                </Typography>
              ))}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
