import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services";

export default function LogoutDialog(props) {
  const { open, handleClose } = props;

  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    handleClose();
    navigate("/");
  };

  return (
    <Dialog open={open} handleClose={handleClose}>
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
