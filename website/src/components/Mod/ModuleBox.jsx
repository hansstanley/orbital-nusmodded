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
import LaunchIcon from "@mui/icons-material/Launch";
import { useMod, useSnackbar } from "../../providers";
import { Draggable } from "@hello-pangea/dnd";
import { NUSMODS, DIMENSIONS } from "../../utils/constants";

/**
 * A module box that has a detailed information dialog
 * and can be set up as a Draggable.
 *
 * @param {object} props
 * @returns A module box component.
 */
export default function ModuleBox({
  moduleCode,
  actions = null,
  isDraggable = false,
  draggableId,
  index,
}) {
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
  }, [moduleCode, getModInfo, pushSnack]);

  const toggleOpen = () => setOpen(!open);

  const handleOpenDialog = () => setDialogOpen(!loading);
  const handleCloseDialog = () => setDialogOpen(false);

  // Placeholder for unknown module codes.
  const unknown = (
    <CardContent>
      <Typography variant="body2">Unknown module {moduleCode}</Typography>
    </CardContent>
  );

  const nusmodsUrl = `${NUSMODS.MOD_PAGE_URL}/${moduleCode}`;

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
          <Divider />
          <DialogContentText>
            {loading ? (
              <Skeleton />
            ) : mod.prerequisite ? (
              "Prerequisites: " + mod.prerequisite
            ) : (
              "No prerequisites."
            )}
          </DialogContentText>
          <Divider />
          <DialogContentText>
            {loading ? (
              <Skeleton />
            ) : mod.preclusion.length !== 0 ? (
              "Preclusion" +
              (mod.preclusion.length > 1 ? "s: " : ": ") +
              mod.preclusion.join(", ")
            ) : (
              "No preclusions."
            )}
          </DialogContentText>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Stack direction="row" spacing={1}>
          <a
            href={nusmodsUrl}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none" }}
          >
            <Button variant="outlined" endIcon={<LaunchIcon />}>
              NUSMods page
            </Button>
          </a>
          <Button onClick={handleCloseDialog}>Close</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  ) : null;

  const content = (
    <>
      {!loading && !mod ? (
        unknown
      ) : (
        <CardActionArea onClick={toggleOpen} disabled={isDraggable}>
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
          <Stack direction="row" spacing={1}>
            {actions}
          </Stack>
        </CardActions>
      </Collapse>
    </>
  );

  return (
    <>
      {isDraggable ? (
        <Draggable
          draggableId={draggableId || moduleCode}
          index={index}
          key={draggableId || moduleCode}
        >
          {(provided, snapshot) => (
            <Card
              sx={{ width: DIMENSIONS.BOX_WIDTH }}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              onClick={toggleOpen}
            >
              {content}
            </Card>
          )}
        </Draggable>
      ) : (
        <Card key={moduleCode} sx={{ width: DIMENSIONS.BOX_WIDTH }}>
          {content}
        </Card>
      )}
      {dialog}
    </>
  );
}
