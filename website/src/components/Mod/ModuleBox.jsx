import { useState } from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
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

import { Mod } from "../../models";
import { useEffect } from "react";

export default function ModuleBox({ id, mod = new Mod() }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(!mod?.acadYear);
  }, [mod]);

  const handleOpenDialog = () => setDialogOpen(!loading);
  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <Card id={id}>
      <CardActionArea onClick={handleOpenDialog}>
        <CardContent sx={{ width: 240 }}>
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
      <Dialog onClose={handleCloseDialog} open={dialogOpen} maxWidth="md">
        <DialogTitle>{`${mod.moduleCode} ${mod.title}`}</DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={1}>
            <DialogContentText>{mod.moduleCredit} MC</DialogContentText>
            <DialogContentText variant="subtitle1">{`${mod.department}, ${mod.faculty}`}</DialogContentText>
            <Divider />
            <DialogContentText>
              {mod.description || "No description."}
            </DialogContentText>
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
