import {
  Alert,
  Box,
  Button,
  Checkbox,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  LinearProgress,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { ModGroup } from "../../models";
import { stringToInt } from "../../utils/parsers";

export default function ModGroupForm({
  open = false,
  loading = false,
  title = "",
  submitLabel = "Submit",
  validationMessage = "",
  modGroup = new ModGroup(),
  handleClose = () => {},
  handleSubmit = (event) => {},
}) {
  const [minimum, setMinimum] = useState(parseInt(modGroup?.minimum) || null);
  const [maximum, setMaximum] = useState(parseInt(modGroup?.maximum) || null);

  useEffect(() => {
    if ((minimum ?? false) && minimum < 0) {
      setMinimum(0);
    }
    if ((maximum ?? false) && maximum < 0) {
      setMaximum(0);
    }
  }, [minimum, maximum]);

  const handleMinimum = (e) => {
    const min = stringToInt(e.target.value);

    if (min === null) {
      setMinimum(min);
    } else if ((maximum ?? false) && min > maximum) {
      setMinimum(min);
      setMaximum(min);
    } else {
      setMinimum(min);
    }
  };
  const handleMaximum = (e) => {
    const max = stringToInt(e.target.value);

    if (max === null) {
      setMaximum(max);
    } else if ((minimum ?? false) && max < minimum) {
      setMinimum(max);
      setMaximum(max);
    } else {
      setMaximum(max);
    }
  };

  const minHelper = useMemo(
    () =>
      minimum === null
        ? "No minimum MC limit for this module group"
        : `At least ${minimum} MC(s) to be taken from this module group`,
    [minimum]
  );
  const maxHelper = useMemo(
    () =>
      maximum === null
        ? "No maximum MC limit for this module group"
        : `At most ${maximum} MC(s) to be take from this module group`,
    [maximum]
  );

  const handleCloseDialog = () => {
    setMinimum(null);
    setMaximum(null);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <Box component="form" onSubmit={handleSubmit}>
        {title ? <DialogTitle>{title}</DialogTitle> : null}
        <DialogContent>
          <TextField
            name="name"
            label="Module Group Name"
            type="text"
            helperText="E.g. GE Modules"
            defaultValue={modGroup.name}
            margin="dense"
            autoFocus
            fullWidth
            required
          />
          <TextField
            name="minimum"
            label="Minimum MCs"
            type="number"
            helperText={minHelper}
            value={minimum ?? ""}
            margin="dense"
            onChange={handleMinimum}
            fullWidth
          />
          <TextField
            name="maximum"
            label="Maximum MCs"
            type="number"
            helperText={maxHelper}
            value={maximum ?? ""}
            margin="dense"
            onChange={handleMaximum}
            fullWidth
          />
          <TextField
            name="description"
            label="Description"
            type="text"
            helperText="A short description of the module group"
            defaultValue={modGroup.description}
            margin="dense"
            fullWidth
            multiline
            minRows={2}
            maxRows={6}
          />
          <FormControlLabel
            control={
              <Checkbox name="global" defaultChecked={!!modGroup.global} />
            }
            label="Make this a global module group"
          />
          <Collapse in={!!validationMessage}>
            <Alert severity="error">{validationMessage}</Alert>
          </Collapse>
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" disabled={loading}>
            {submitLabel}
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
        {loading ? (
          <LinearProgress />
        ) : (
          <LinearProgress variant="determinate" value={100} />
        )}
      </Box>
    </Dialog>
  );
}
