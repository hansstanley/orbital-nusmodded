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
import { Draggable } from "react-beautiful-dnd";
import ResponsiveStack from "../../components/ResponsiveStack";
import { ModuleStack } from "../../components/Mod";

export default function ModGroupBox({
  name,
  actions = null,
  isDraggable = false,
  index,
}) {
  const { getModInfo } = useMod();
  const { pushSnack } = useSnackbar();
  const [mod, setMod] = useState(null);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogModGroupOpen, setDialogModGroupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [arr, setArr] = useState([]);
  const [modGroup, setModGroup] = useState(null);
  const [modGroupMods, setModGroupMods] = useState(null);
  const { getModGroupMods, getModGroupArray } = useModGroup();
  const { updateModuleGroup, getAllMods, roadmap } = useRoadmap();

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const arr = name.split("^");
        setArr(arr);
        const modGroupName = arr[1];
        const modGroupArray = getModGroupArray();
        const modGroup = modGroupArray.find((mg) => mg.name === modGroupName);
        const data = await getModGroupMods(modGroup.id);
        setModGroupMods(data);
        setModGroup(modGroup);
        if (arr[3] !== "") {
          const mod = await getModInfo(arr[3]);
          setMod(mod);
        }
      } catch (error) {
        console.error(error);
        pushSnack({
          message: `Error loading ${name}`,
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [name, getModGroupMods, getModInfo, getModGroupArray, pushSnack]);

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
          .map((mod) => (mod[0] === "^" ? mod.split("^")[3] : mod))
          .includes(moduleCode)
      );
      if (!semWithMod.year) {
        return "My Modules";
      }
      return "Y" + semWithMod.year + "S" + semWithMod.semester;
    }
    if (!updateModuleGroup(arr, moduleCode)) {
      return "";
    }
    const mod = await getModInfo(moduleCode);
    setMod(mod);
    let newArr = arr;
    newArr[3] = moduleCode;
    setArr(newArr);
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
            </Stack>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      ) : (
        <></>
      )}
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
      ) : (
        <></>
      )}
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
          {mod ? (
            <>
              <Button onClick={handleOpenDialog}>{"View"}</Button>
              <Button onClick={handleOpenSelectDialog}>{"Select"}</Button>
            </>
          ) : (
            <Button onClick={handleOpenSelectDialog}>{"Select"}</Button>
          )}
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
              sx={{ width: 320 }}
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
        <Card key={name} sx={{ width: 320 }}>
          {content}
        </Card>
      )}
      {dialog}
    </>
  );
}
