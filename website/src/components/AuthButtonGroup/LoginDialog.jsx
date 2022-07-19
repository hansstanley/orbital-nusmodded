import { useState } from "react";
import {
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Collapse,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthSession, useSnackbar } from "../../providers";
import ResponsiveDialog from "../ResponsiveDialog";
import LoadingBar from "../LoadingBar";

export default function LoginDialog({ open = false, handleClose = () => {} }) {
  const navigate = useNavigate();
  const { handleSignin } = useAuthSession();
  const { pushSnack } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validateInput, setValidateInput] = useState("");

  const handleCloseReset = () => {
    setEmail("");
    setPassword("");
    setValidateInput("");
    handleClose();
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    try {
      await handleSignin({
        email: email,
        password: password,
      });
      handleCloseReset();
      navigate("/roadmap");
    } catch (error) {
      console.error(error);
      setValidateInput(error.message || "Error logging in");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    pushSnack({
      message:
        "Sorry! We need you to remember your password until we have built this feature.",
      severity: "warning",
    });
  };

  return (
    <ResponsiveDialog component="form" open={open} onClose={handleClose}>
      <DialogContent>
        <DialogContentText variant="h5" sx={{ fontWeight: "bold" }}>Login</DialogContentText>
        <DialogContentText
          variant="h3"
          color="primary"
          sx={{ fontWeight: "bold" }}
        >
          NUSMODDED
        </DialogContentText>
        <TextField
          name="email"
          label="Email"
          type="email"
          margin="dense"
          autoFocus
          fullWidth
          required
          defaultValue={email}
          onChange={handleEmailChange}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          margin="dense"
          fullWidth
          required
          defaultValue={password}
          onChange={handlePasswordChange}
        />
        <Button size="small" onClick={handleForgotPassword}>
          Forgot password
        </Button>
        <Collapse in={!!validateInput}>
          <Alert severity="error">{validateInput}</Alert>
        </Collapse>
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          onClick={handleSubmit}
        >
          Login
        </Button>
        <Button onClick={handleCloseReset}>Cancel</Button>
      </DialogActions>
      <LoadingBar loading={loading} />
    </ResponsiveDialog>
  );
}
