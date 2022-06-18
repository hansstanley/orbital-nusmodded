import { Button } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthSession } from "../../providers";
import LogoutDialog from "./LogoutDialog";

export default function SignUpButton() {
  const navigate = useNavigate();
  const { signedIn } = useAuthSession();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleOpenDialog = () => setDialogOpen(true);

  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <>
      <LogoutDialog open={dialogOpen} handleClose={handleCloseDialog} />
      {signedIn ? (
        <Button variant="outlined" onClick={handleOpenDialog}>
          Logout
        </Button>
      ) : (
        <Button variant="contained" onClick={handleSignUp}>
          Sign Up
        </Button>
      )}
    </>
  );
}
