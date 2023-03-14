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
import { useRoadmap, useMod, useSnackbar, useModGroup } from "../../providers";
import { Draggable } from "@hello-pangea/dnd";
import ResponsiveStack from "../../components/ResponsiveStack";
import { ModuleStack } from "../../components/Mod";
import { NUSMODS, DIMENSIONS } from "../../utils/constants";
import LaunchIcon from "@mui/icons-material/Launch";

export default function ModGroupBox({
  name = "",
  actions = null,
  isDraggable = false,
  index,
}) {
  const { getModArray, getModInfo } = useMod();
  const { getModGroupMods, getModGroupArray, parseModGroupString } =
    useModGroup();
  const { updateModuleGroup, getAllMods, roadmap } = useRoadmap();
  const { pushSnack } = useSnackbar();
  const [mod, setMod] = useState(null);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogModGroupOpen, setDialogModGroupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [parsed, setParsed] = useState(null);
  const [modGroup, setModGroup] = useState(null);
  const [modGroupMods, setModGroupMods] = useState(null);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const modGroupData = parseModGroupString(name);
        if (!modGroupData) throw new Error(`Invalid module group ${name}`);
        setParsed(modGroupData);

        const modGroupName = modGroupData?.name;
        const modGroupArray = getModGroupArray();
        const modGroup = modGroupArray.find((mg) => mg.name === modGroupName);
        const data = await getModGroupMods(modGroup.id);
        setModGroupMods(data);
        if (data.length === 0) {
          const data = await getModArray();
          setModGroupMods(data);
        }
        setModGroup(modGroup);
        if (modGroupData?.moduleCode) {
          const mod = await getModInfo(modGroupData.moduleCode);
          setMod(mod);
        }
      } catch (error) {
        console.error(error);
        pushSnack({
          message: `Error loading module group ${name}`,
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [
    name,
    getModArray,
    getModGroupMods,
    getModInfo,
    getModGroupArray,
    pushSnack,
    parseModGroupString,
  ]);

  const toggleOpen = () => setOpen(!open);

  const handleOpenDialog = () => setDialogOpen(!loading);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleOpenSelectDialog = () => setDialogModGroupOpen(!loading);
  const handleCloseSelectDialog = () => setDialogModGroupOpen(false);

  const unknown = (
    <CardContent>
      <Typography variant="body2">{`Unknown module ${name}`}</Typography>
    </CardContent>
  );

  const handleSelectMod = async (moduleCode) => {
    if (getAllMods().includes(moduleCode)) {
      const semWithMod = roadmap.find((sem) =>
        sem.modules
          .map((mod) => parseModGroupString(mod)?.moduleCode || mod)
          .includes(moduleCode)
      );
      if (!semWithMod.year) {
        return "My Modules";
      }
      return "Y" + semWithMod.year + "S" + semWithMod.semester;
    }

    const newId = updateModuleGroup(parsed, moduleCode);
    if (!newId) return "";

    const mod = await getModInfo(moduleCode);
    setMod(mod);
    setParsed(parseModGroupString(newId));

    return moduleCode;
  };

  const dialog = (
    <>
      {mod ? (
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
                href={`${NUSMODS.MOD_PAGE_URL}/${mod.moduleCode}`}
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
      ) : null}
      {modGroup ? (
        <Dialog
          open={dialogModGroupOpen}
          onClose={handleCloseSelectDialog}
          maxWidth="md"
        >
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
                mods={modGroupMods}
                handleSelectMod={handleSelectMod}
                isCourse={true}
                isSelect={true}
              />
            </ResponsiveStack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSelectDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </>
  );

  const content = (
    <>
      {!loading && !modGroup ? (
        unknown
      ) : mod ? (
        <CardActionArea onClick={toggleOpen} disabled={isDraggable}>
          <CardContent>
            <Typography variant="subtitle2">
              {loading ? (
                <Skeleton />
              ) : (
                `${mod.moduleCredit} MC, from ${modGroup.name}`
              )}
            </Typography>
            <Typography variant="subtitle1">
              {loading ? <Skeleton /> : mod.moduleCode}
            </Typography>
            <Typography variant="body2">
              {loading ? <Skeleton /> : mod.title}
            </Typography>
          </CardContent>
        </CardActionArea>
      ) : (
        <CardActionArea onClick={toggleOpen} disabled={isDraggable}>
          <CardContent>
            <Typography variant="subtitle2">
              {loading ? <Skeleton /> : `? MCs`}
            </Typography>
            <Typography variant="subtitle1">
              {loading ? <Skeleton /> : `${modGroup.name}`}
            </Typography>
            <Typography variant="body2">
              {loading ? (
                <Skeleton />
              ) : (
                `Click to select a module from ${modGroup.name}`
              )}
            </Typography>
          </CardContent>
        </CardActionArea>
      )}
      <Collapse in={open}>
        <Divider />
        <CardActions sx={{ justifyContent: "space-between" }}>
          {mod ? <Button onClick={handleOpenDialog}>View</Button> : null}
          <Button onClick={handleOpenSelectDialog}>Choose module</Button>
          {actions}
        </CardActions>
      </Collapse>
    </>
  );

  return (
    <>
      {isDraggable ? (
        <Draggable draggableId={name} index={index} key={name}>
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
        <Card key={name} sx={{ width: DIMENSIONS.BOX_WIDTH }}>
          {content}
        </Card>
      )}
      {dialog}
    </>
  );
}
