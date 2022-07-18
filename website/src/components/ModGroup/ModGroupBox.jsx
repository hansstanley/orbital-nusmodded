import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ModGroup } from "../../models";
import { useModGroup, useSnackbar } from "../../providers";
import ModuleStack from "../Mod/ModuleStack";
import ResponsiveStack from "../ResponsiveStack";

export default function ModGroupBox({
  modGroup = new ModGroup(),
  actions = null,
  isDraggable = false,
  index,
}) {
  const { getModGroupMods, bindModGroupMods, unbindModGroupMods } =
    useModGroup();
  const { pushSnack } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [mods, setMods] = useState([]);
  const [refreshMods, setRefreshMods] = useState(true);

  useEffect(() => {
    async function loadMods() {
      try {
        const data = await getModGroupMods(modGroup.id);
        setMods(data);
      } catch (error) {
        console.error(error);
        pushSnack({
          message:
            error.message || `Error loading module group ${modGroup.name}`,
          severity: "error",
        });
      } finally {
        setRefreshMods(false);
      }
    }

    if (refreshMods && modGroup.id) loadMods();
  }, [refreshMods, modGroup, getModGroupMods, pushSnack]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddMods = async (moduleCodes) => {
    const added = await bindModGroupMods(modGroup.id, { moduleCodes });
    setRefreshMods(true);
    return added;
  };

  const handleDeleteMod = async (moduleCode) => {
    const count = await unbindModGroupMods(modGroup.id, {
      moduleCodes: [moduleCode],
    });
    setRefreshMods(true);
    return count;
  };

  const handleModChips = () =>
    mods.length ? (
      mods.map((mod) => (
        <Chip
          key={mod.moduleCode}
          label={mod.moduleCode}
          sx={{ mr: 1, mb: 1 }}
        />
      ))
    ) : (
      <Typography variant="body2">No modules.</Typography>
    );

  const content = (
    <Accordion key={modGroup.id}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{modGroup.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={1}>
          <Typography variant="body2">{modGroup.description}</Typography>
          <Divider />
          <Stack direction="row" flexWrap="wrap">
            {handleModChips()}
          </Stack>
        </Stack>
      </AccordionDetails>
      <AccordionActions>
        {actions}
        <Button onClick={handleOpen}>View</Button>
      </AccordionActions>
    </Accordion>
  );

  return (
    <>
      {isDraggable ? (
        <Draggable
          draggableId={`${modGroup.id}`}
          index={index}
          key={`${modGroup.id}`}
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              {content}
            </div>
          )}
        </Draggable>
      ) : (
        content
      )}
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle>{modGroup ? modGroup.name : <Skeleton />}</DialogTitle>
        <DialogContent dividers>
          <ResponsiveStack>
            <Stack spacing={1} divider={<Divider />}>
              {modGroup.global ? (
                <Typography variant="body2">
                  This is a global module group.
                </Typography>
              ) : null}
              {modGroup.minimum ? (
                <Typography variant="body2">
                  Minimum: {modGroup.minimum} MCs
                </Typography>
              ) : null}
              {modGroup.maximum ? (
                <Typography variant="body2">
                  Maximum: {modGroup.maximum} MCs
                </Typography>
              ) : null}
              <Typography>
                {modGroup ? (
                  modGroup.description
                ) : (
                  <Skeleton variant="rectangular" />
                )}
              </Typography>
            </Stack>
            <ModuleStack
              mods={mods}
              handleAddMods={handleAddMods}
              handleDeleteMod={handleDeleteMod}
              isCourse={true}
            />
          </ResponsiveStack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
