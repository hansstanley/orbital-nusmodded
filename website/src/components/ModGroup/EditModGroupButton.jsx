import { Button } from "@mui/material";
import { useState } from "react";
import { ModGroup } from "../../models";
import { useAuthSession, useModGroup, useSnackbar } from "../../providers";
import ModGroupForm from "./ModGroupForm";
import { stringToInt } from "../../utils/parsers";

export default function EditModGroupButton({
  modGroup = new ModGroup(),
  variant = "text",
  handleBindModGroup = async (groupId) => {},
}) {
  const { isAuth } = useAuthSession();
  const { updateModGroup } = useModGroup();
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
      const newModGroup = await updateModGroup(modGroup.id, params);
      await handleBindModGroup(newModGroup.id);

      pushSnack({
        message: `Updated ${newModGroup.name}!`,
        severity: "success",
      });
      handleClose();
    } catch (error) {
      console.error(error);
      setValidationMessage(error.message || "Error updating module group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        onClick={handleOpen}
        disabled={!isAuth() || open}
      >
        Edit
      </Button>
      <ModGroupForm
        open={open}
        loading={loading}
        title="Edit module group"
        submitLabel="Edit"
        modGroup={modGroup}
        validationMessage={validationMessage}
        handleSubmit={handleSubmit}
        handleClose={handleClose}
      />
    </>
  );
}
