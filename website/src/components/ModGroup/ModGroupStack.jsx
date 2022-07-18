import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useAuthSession, useModGroup, useSnackbar } from "../../providers";
import ModGroupBox from "./ModGroupBox";
import ModGroupForm from "./ModGroupForm";
import { stringToInt } from "../../utils/parsers";
import EditModGroupButton from "./EditModGroupButton";
import { Droppable } from "react-beautiful-dnd";
import { DIMENSIONS } from "../../utils/constants";

export default function ModGroupStack({
  title = "Module groups",
  modGroups = [],
  handleBindModGroup = async (groupId) => {},
  handleUnbindModGroup = async (groupId) => {},
  isCourse = false,
  isDroppable = false,
  droppableId,
}) {
  const { isAdmin } = useAuthSession();
  const { createModGroup } = useModGroup();
  const { pushSnack } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setValidationMessage("");
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    setValidationMessage("");
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const params = {
        name: data.get("name"),
        description: data.get("description") || null,
        minimum: stringToInt(data.get("minimum")),
        maximum: stringToInt(data.get("maximum")),
        global: !!data.get("global"),
      };
      const modGroup = await createModGroup(params);
      await handleBindModGroup(modGroup.id);

      pushSnack({
        message: `Created ${modGroup.name}!`,
        severity: "success",
      });
      handleClose();
    } catch (error) {
      console.error(error);
      setValidationMessage(error.message || "Error creating module group");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (groupId) => async () => {
    setLoading(true);

    try {
      await handleUnbindModGroup(groupId);
      pushSnack({
        message: "Module group deleted!",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      pushSnack({
        message: error.message || `Unable to delete module group ${groupId}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const modGroupList = modGroups.length ? (
    modGroups.map((modGroup, index) => (
      <ModGroupBox
        key={modGroup.id}
        modGroup={modGroup}
        isDraggable={isDroppable}
        index={index}
        actions={
          !isCourse || isAdmin() ? (
            <>
              <Button
                color="error"
                disabled={loading}
                onClick={handleDelete(modGroup.id)}
              >
                Delete
              </Button>
              <EditModGroupButton
                modGroup={modGroup}
                handleBindModGroup={handleBindModGroup}
              />
            </>
          ) : null
        }
      />
    ))
  ) : (
    <Typography variant="body2">No module groups.</Typography>
  );

  return (
    <Stack spacing={1} width={DIMENSIONS.BOX_WIDTH}>
      <Stack
        spacing={2}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6">{title}</Typography>
        {!isCourse || isAdmin() ? (
          <IconButton color="primary" onClick={handleOpen}>
            <AddIcon />
          </IconButton>
        ) : null}
      </Stack>
      <Divider />
      <Box>
        {isDroppable ? (
          <Droppable droppableId={`${droppableId}`}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {modGroupList}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ) : (
          modGroupList
        )}
      </Box>
      <ModGroupForm
        open={open}
        loading={loading}
        title="Add module group"
        submitLabel="Add"
        validationMessage={validationMessage}
        handleSubmit={handleSubmit}
        handleClose={handleClose}
      />
    </Stack>
  );
}
