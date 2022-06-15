import * as React from 'react';
import {
  Button,
  Dialog,
  Typography,
  Card,
  TextField,
  Stack,
  Box,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services";

export default function LoginDialog({ open, handleClose }) {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [validateInput, setValidateInput] = React.useState("");

  const handleCloseReset = () => {
    setEmail("");
    setPassword("");
    setValidateInput("");
    handleClose();
  }
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const { user, session, error } = await supabase.auth.signIn({
        email: data.get('email'),
        password: data.get('password'),
    });
    console.log(error);
    if (error === null) {
      setValidateInput("");
      handleCloseReset();
      navigate("/");
    } else {
      setValidateInput("Invalid login credentials!");
    }
  }

  return (
    <Dialog open={open} handleClose={handleClose}>
      <Card sx={{
                display: 'flex',
                flexDirection: 'column',
                m: 0,
                width: 'fit-content',
                padding: 4,
                paddingBottom: 10,
                paddingTop: 8,
              }}>
        <Box component="form" onSubmit={handleSubmit} >
          <Stack spacing = {2}>
            <Box>
              <Typography align="center" variant="h3" paddingLeft={2} paddingRight={2} color="primary">
                NUSMODDED
              </Typography>
              <Typography align="center" variant="h5" paddingLeft={2} paddingRight={2} paddingBottom={2}>
                Login
              </Typography>
            </Box>
            <Stack></Stack><Stack></Stack>
            <TextField
              label="Email"
              name = "email"
              defaultValue= {email}
              size="small"
              required
              onChange = {handleEmailChange}
            />
            <Stack>
            <TextField
              type="password"
              label="Password"
              name = "password"
              defaultValue= {password}
              size="small"
              required
              onChange = {handlePasswordChange}
            />
            <Link>
              <Typography variant="caption" paddingLeft = {0.2}>
                Forget Password?
              </Typography>
            </Link>
            </Stack>
            <Stack></Stack>
            <Stack direction = "row" spacing = {2} justifyContent="space-evenly">
              <Button variant="contained" autoFocus type="submit" size = 'large'>
                Login
              </Button>
              <Button variant="outlined" onClick={handleCloseReset} size = 'large'>
                Cancel
              </Button>
            </Stack>
            <Typography color = "primary.light">{validateInput}</Typography>
            <Stack></Stack>
          </Stack>
        </Box>
      </Card>
    </Dialog>
  );
}
