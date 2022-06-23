import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useMod, useSnackbar } from "../../providers";

export default function ModuleBox({ id, moduleCode, actions = null }) {
  const { getModInfo } = useMod();
  const { pushSnack } = useSnackbar();
  const [mod, setMod] = useState(null);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const mod = await getModInfo(moduleCode);
        setMod(mod);
      } catch (error) {
        console.error(error);
        pushSnack({
          message: `Error loading ${moduleCode}`,
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [pushSnack]);

  const toggleOpen = () => setOpen(!open);

  const handleOpenDialog = () => setDialogOpen(!loading);
  const handleCloseDialog = () => setDialogOpen(false);

  const unknown = (
    <CardContent>
      <Typography variant="body2">{`Unknown module ${moduleCode}`}</Typography>
    </CardContent>
  );

  const dialog = mod ? (
    <Dialog onClose={handleCloseDialog} open={dialogOpen} maxWidth="md">
      <DialogTitle minWidth="240">
        {loading ? <Skeleton /> : `${mod.moduleCode} ${mod.title}`}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={1}>
          <DialogContentText>
            {loading ? <Skeleton /> : mod.moduleCredit} MC
          </DialogContentText>
          <DialogContentText variant="subtitle1">
            {loading ? <Skeleton /> : `${mod.department}, ${mod.faculty}`}
          </DialogContentText>
          <Divider />
          <DialogContentText>
            {loading ? <Skeleton /> : mod.description || "No description."}
          </DialogContentText>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleCloseDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  ) : null;

  return (
    <Card key={id} sx={{ width: 320 }}>
      {!loading && !mod ? (
        unknown
      ) : (
        <CardActionArea onClick={toggleOpen}>
          <CardContent>
            <Typography variant="subtitle2">
              {loading ? <Skeleton /> : `${mod.moduleCredit} MC`}
            </Typography>
            <Typography variant="subtitle1">
              {loading ? <Skeleton /> : mod.moduleCode}
            </Typography>
            <Typography variant="body2">
              {loading ? <Skeleton /> : mod.title}
            </Typography>
          </CardContent>
        </CardActionArea>
      )}
      <Collapse in={open}>
        <Divider />
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Button onClick={handleOpenDialog}>View</Button>
          {actions}
        </CardActions>
      </Collapse>
      {dialog}
    </Card>
  );
}
