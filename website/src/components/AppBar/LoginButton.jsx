import { Button } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthSessionContext } from "../../contexts";
import LogoutDialog from "./LogoutDialog";

export default function LoginButton() {
  const navigate = useNavigate();
  const { signedIn } = useContext(AuthSessionContext);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleLogin = () => {
    navigate("/login");
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
        <Button variant="contained" onClick={handleLogin}>
          Login
        </Button>
      )}
    </>
  );
}