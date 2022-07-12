import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Alert,
  Button,
  ButtonGroup,
  IconButton,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const severities = ["success", "info", "warning", "error"];

const SnackbarContext = createContext({
  pushSnack: ({ message, severity, action }) => {},
});

function SnackbarProvider({ children, stacked = false }) {
  const [snackPack, setSnackPack] = useState([]);
  const [open, setOpen] = useState(false);
  const [snack, setSnack] = useState(undefined);

  useEffect(() => {
    if (snackPack.length && !snack) {
      setSnack({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (!stacked && snackPack.length && snack && open) {
      setOpen(false);
    }
  }, [open, snack, snackPack]);

  const pushSnack = useCallback(({ message, severity, action }) => {
    setSnackPack((prev) => [
      ...prev,
      { message: message, severity: severity, action: action },
    ]);
  }, []);

  const handleLatest = () => {
    setOpen(false);
    setSnackPack((prev) => prev.slice(-1));
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;

    setOpen(false);
  };

  const handleExited = () => {
    setSnack(undefined);
  };

  const defaultAction =
    stacked && snackPack.length > 0 ? (
      <ButtonGroup size="small" variant="text" color="inherit">
        <Button size="small" onClick={handleClose}>
          +{snackPack.length} more
        </Button>
        <Button size="small" onClick={handleLatest}>
          Latest
        </Button>
      </ButtonGroup>
    ) : (
      <IconButton color="inherit" size="small" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    );

  const value = useMemo(() => ({ pushSnack }), [pushSnack]);

  return (
    <SnackbarContext.Provider value={value}>
      {snack && severities.includes(snack.severity) ? (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          TransitionProps={{ onExited: handleExited }}
        >
          <Alert
            variant="filled"
            severity={snack.severity}
            action={snack?.action || defaultAction}
          >
            {snack.message}
          </Alert>
        </Snackbar>
      ) : (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          TransitionProps={{ onExited: handleExited }}
          message={snack?.message || undefined}
          action={snack?.action || defaultAction}
        />
      )}
      {children}
    </SnackbarContext.Provider>
  );
}

function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!(context ?? false)) {
    throw new Error("useSnackbar must be used within an SnackbarProvider");
  }

  return context;
}

export { SnackbarProvider, useSnackbar };
