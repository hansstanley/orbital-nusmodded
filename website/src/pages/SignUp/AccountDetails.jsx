import { useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Collapse,
  Alert,
  Stack,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuthSession, useSnackbar } from "../../providers";
import { TransitionGroup } from "react-transition-group";
import { AltAuth } from "../../components";
import { useNavigate } from "react-router-dom";

export default function SignUp({ handleNext }) {
  const navigate = useNavigate();
  const { handleSignup } = useAuthSession();
  const { pushSnack } = useSnackbar();
  const [validateInput, setValidateInput] = useState([]);
  const [loading, setLoading] = useState(false);
  const emailCheck =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const passwordCheck = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const username = data.get("username");
    const email = data.get("email");
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");

    let passed = true;
    setValidateInput([]);
    if (username.length < 3) {
      passed = false;
      setValidateInput((prev) => [
        ...prev,
        "Username is too short! (minimum 3 characters)",
      ]);
    }
    if (!emailCheck.test(email)) {
      passed = false;
      setValidateInput((prev) => [...prev, "Email entered is invalid!"]);
    }
    if (password.length < 8) {
      passed = false;
      setValidateInput((prev) => [
        ...prev,
        "Password is too short! (minimum 8 characters)",
      ]);
    }
    if (password.toLowerCase() === password) {
      passed = false;
      setValidateInput((prev) => [
        ...prev,
        "Password should contain at least one uppercase letter.",
      ]);
    }
    if (password.toUpperCase() === password) {
      passed = false;
      setValidateInput((prev) => [
        ...prev,
        "Password should contain at least one lowercase letter.",
      ]);
    }
    if (!/\d/.test(password)) {
      passed = false;
      setValidateInput((prev) => [
        ...prev,
        "Password should contain at least one number.",
      ]);
    }
    if (!passwordCheck.test(password)) {
      passed = false;
      setValidateInput((prev) => [...prev, "Password entered is invalid!"]);
    }
    if (password !== confirmPassword) {
      passed = false;
      setValidateInput((prev) => [...prev, "Passwords do not match!"]);
    }

    if (passed) {
      setLoading(true);
      try {
        await handleSignup({
          username,
          email,
          password,
        });
        handleNext();
      } catch (error) {
        console.warn(error);
        pushSnack({
          message: error.message || "Unable to sign up",
          severity: "warning",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const hasValidateInput =
    Array.isArray(validateInput) && !!validateInput.length;

  return (
    <Box sx={{ width: { xs: "100%", sm: 360 } }}>
      <Stack
        component="form"
        onSubmit={handleSubmit}
        spacing={2}
        alignItems="center"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h6">Sign up</Typography>
        </Stack>
        <TextField
          name="username"
          required
          fullWidth
          id="username"
          label="Username"
          autoFocus
        />
        <TextField
          required
          fullWidth
          id="email"
          type="email"
          label="Email Address"
          name="email"
        />
        <TextField
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
        />
        <TextField
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
        />
        <TransitionGroup>
          {validateInput.map((msg, index) => (
            <Collapse
              key={index}
              in={hasValidateInput}
              sx={{ width: "100%", mt: 1 }}
              unmountOnExit
            >
              <Alert severity="error">
                <Typography variant="body2">{msg}</Typography>
              </Alert>
            </Collapse>
          ))}
        </TransitionGroup>
        <Button disabled={loading} type="submit" variant="contained" fullWidth>
          Sign Up
        </Button>
        <AltAuth onDone={() => navigate("/signup")} />
      </Stack>
    </Box>
  );
}
