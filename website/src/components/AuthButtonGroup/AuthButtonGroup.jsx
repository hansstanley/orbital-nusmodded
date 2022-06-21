import { Button, ButtonGroup } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccessToken } from "../../providers";
import LoginDialog from "./LoginDialog";
import LogoutDialog from "./LogoutDialog";

export default function AuthButtonGroup() {
  const navigate = useNavigate();
  const { hasAccess } = useAccessToken();
  const [loginOpen, setLoginOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);

  const handleLogoutOpen = () => setLogoutOpen(true);
  const handleLogoutClose = () => setLogoutOpen(false);

  const handleSignup = () => navigate("/signup");

  return (
    <>
      <LoginDialog open={loginOpen} handleClose={handleLoginClose} />
      <LogoutDialog open={logoutOpen} handleClose={handleLogoutClose} />
      {hasAccess ? (
        <Button variant="outlined" onClick={handleLogoutOpen}>
          Logout
        </Button>
      ) : (
        <ButtonGroup variant="contained">
          <Button onClick={handleLoginOpen}>Login</Button>
          <Button onClick={handleSignup}>Sign up</Button>
        </ButtonGroup>
      )}
    </>
  );
}
