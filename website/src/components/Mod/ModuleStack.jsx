import { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Box,
  Card,
  Collapse,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Zoom,
  CardContent,
  CardActions,
  createFilterOptions,
  LinearProgress,
  Divider,
  InputAdornment,
} from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { useAuthSession, useMod, useSnackbar } from "../../providers";
import ModuleBox from "./ModuleBox";

export default function ModuleStack({
  title = "Modules",
  mods = [],
  handleAddMods = async (moduleCodes = []) => {},
  handleDeleteMod = async (moduleCode) => {},
}) {
  const { isAuth } = useAuthSession();
  const { getModArray } = useMod();
  const { pushSnack } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modArray, setModArray] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const modArray = await getModArray();
        modArray.sort((mod1, mod2) =>
          mod1.moduleCode.localeCompare(mod2.moduleCode)
        );
        setModArray(modArray);
      } catch (error) {
        console.error(error);
        pushSnack({
          message: error.message || "Unable to load modules",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [getModArray, pushSnack]);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleClearSearch = () => setSearch("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelected([]);
  };

  const handleAutocomplete = (e, value) => {
    setSelected(value);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const added = await handleAddMods(selected.map((mod) => mod.moduleCode));
      handleClose();
      if (Array.isArray(added) && added.length) {
        pushSnack({
          message: `${added.join(", ")} added!`,
          severity: "success",
        });
      }
    } catch (error) {
      console.error(error);
      pushSnack({
        message: error.message || "Unable to add modules",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const sortMods = useCallback(
    () =>
      mods.filter((mod) =>
        mod.moduleCode.includes((search || "").trim().toUpperCase())
      ),
    [mods, search]
  );

  const handleDelete = (moduleCode) => async () => {
    setLoading(true);

    try {
      await handleDeleteMod(moduleCode);
      pushSnack({
        message: `${moduleCode} deleted!`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      pushSnack({
        message: error.message || `Unable to delete ${moduleCode}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={1} width={320}>
      <Stack
        spacing={2}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6">{title}</Typography>
        <Zoom in={!open}>
          <IconButton
            size="inherit"
            color="primary"
            onClick={handleOpen}
            disabled={!isAuth()}
          >
            <AddIcon />
          </IconButton>
        </Zoom>
      </Stack>
      <TextField
        fullWidth
        size="small"
        margin="dense"
        label="Search module code"
        value={search}
        onChange={handleSearch}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Zoom in={!!search}>
                <IconButton edge="end" onClick={handleClearSearch}>
                  <ClearIcon />
                </IconButton>
              </Zoom>
            </InputAdornment>
          ),
        }}
      />
      <Divider />
      <Collapse in={open}>
        <Card>
          <CardContent>
            <Autocomplete
              id="mod-select"
              autoHighlight
              fullWidth
              multiple
              onChange={handleAutocomplete}
              value={selected}
              options={modArray}
              getOptionLabel={(option) => option.moduleCode}
              isOptionEqualToValue={(option, value) =>
                option.moduleCode === value.moduleCode
              }
              renderOption={(props, option) => (
                <Tooltip
                  key={option.moduleCode}
                  title={option.title}
                  placement="left"
                >
                  <Box component="li" {...props}>
                    <Typography>{option.moduleCode}</Typography>
                  </Box>
                </Tooltip>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search modules"
                  placeholder="Add modules"
                  size="small"
                />
              )}
              filterOptions={createFilterOptions({ limit: 100 })}
            />
          </CardContent>
          <CardActions>
            <Button variant="contained" onClick={handleSubmit}>
              Add
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </CardActions>
          {loading ? (
            <LinearProgress />
          ) : (
            <LinearProgress variant="determinate" value={100} />
          )}
        </Card>
      </Collapse>
      <TransitionGroup component={Stack} spacing={1}>
        {sortMods().map((mod) => (
          <Collapse key={mod.moduleCode}>
            <ModuleBox
              key={mod.moduleCode}
              moduleCode={mod.moduleCode}
              actions={
                <Button
                  color="error"
                  disabled={!isAuth() || loading}
                  onClick={handleDelete(mod.moduleCode)}
                >
                  Delete
                </Button>
              }
            />
          </Collapse>
        ))}
      </TransitionGroup>
      {sortMods().length ? null : (
        <Typography variant="body2">No modules.</Typography>
      )}
    </Stack>
  );
}
