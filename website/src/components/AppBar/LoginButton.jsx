import { Button } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthSession } from "../../providers";
import LoginDialog from "./LoginDialog";

export default function LoginButton() {
  const navigate = useNavigate();
  const { signedIn } = useAuthSession();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleOpenDialog = () => setDialogOpen(true);

  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <>
      {signedIn ? (
        <></>
      ) : (
        <Button variant="contained" onClick={handleOpenDialog}>
          Login
        </Button>
      )}
      <LoginDialog open={dialogOpen} handleClose={handleCloseDialog} />
    </>
  );
}
