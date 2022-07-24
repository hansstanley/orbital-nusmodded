import { Button, ButtonGroup } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthSession } from "../../providers";
import LoginDialog from "./LoginDialog";
import LogoutDialog from "./LogoutDialog";

/**
 * A self-contained component to handle logins and logouts.
 *
 * @returns A button group with login and logout dialogs.
 */
export default function AuthButtonGroup() {
  const navigate = useNavigate();
  const { loading, isAuth } = useAuthSession();
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
      {isAuth() ? (
        <Button
          variant="outlined"
          onClick={handleLogoutOpen}
          disabled={logoutOpen}
        >
          Logout
        </Button>
      ) : (
        <ButtonGroup variant="contained">
          <Button onClick={handleLoginOpen} disabled={loading || loginOpen}>
            Login
          </Button>
          <Button onClick={handleSignup} disabled={loading}>
            Sign up
          </Button>
        </ButtonGroup>
      )}
    </>
  );
}
