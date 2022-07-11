import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthSession } from "../../providers";

export default function LogoutDialog({ open = false, handleClose = () => {} }) {
  const navigate = useNavigate();
  const { handleSignout } = useAuthSession();

  const handleLogout = async () => {
    await handleSignout();
    handleClose();
    navigate("/");
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Logout</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you wish to logout?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" autoFocus onClick={handleLogout}>
          Yes
        </Button>
        <Button variant="outlined" onClick={handleClose}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}
