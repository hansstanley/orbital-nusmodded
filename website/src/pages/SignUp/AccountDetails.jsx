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
import { useAuthSession } from "../../providers";

export default function SignUp({ handleNext }) {
  const [validateInput, setValidateInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleSignup } = useAuthSession();
  const emailCheck =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const passwordCheck = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setValidateInput("");
    if (data.get("username").length < 3) {
      setValidateInput("Username is too short! (minimum 3 characters)");
    } else if (emailCheck.test(data.get("email"))) {
      if (data.get("password") === data.get("confirmPassword")) {
        if (passwordCheck.test(data.get("password"))) {
          setLoading(true);
          const user = await handleSignup({
            username: data.get("username"),
            email: data.get("email"),
            password: data.get("password"),
          });
          setLoading(false);
          console.log("successfully signed up!", user);
          handleNext();
        } else if (data.get("password").length < 8) {
          setValidateInput("Password is too short! (minimum 8 characters)");
        } else if (
          data.get("password").toLowerCase() === data.get("password")
        ) {
          setValidateInput(
            "Password does not contain at least one uppercase letter"
          );
        } else if (
          data.get("password").toUpperCase() === data.get("password")
        ) {
          setValidateInput(
            "Password does not contain at least one lowercase letter"
          );
        } else {
          setValidateInput("Password does not contain at least one number");
        }
      } else {
        setValidateInput("Password does not match!");
      }
    } else {
      setValidateInput("Email entered is invalid!");
    }
  };

  const hasValidateInput = typeof validateInput === "string" && !!validateInput;

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
        <Collapse in={hasValidateInput} unmountOnExit>
          <Alert severity="error">{validateInput}</Alert>
        </Collapse>
        <Button disabled={loading} type="submit" variant="contained" fullWidth>
          Sign Up
        </Button>
      </Stack>
    </Box>
  );
}
