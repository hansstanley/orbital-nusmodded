import { useState } from "react";
import {
  Button,
  Dialog,
  TextField,
  Box,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
  useTheme,
  Collapse,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthSession, useSnackbar } from "../../providers";

export default function LoginDialog({ open, handleClose }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validateInput, setValidateInput] = useState("");
  const { handleSignin } = useAuthSession();
  const { pushSnack } = useSnackbar();

  // Enables responsive dialog box
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
    const data = new FormData(event.currentTarget);
    try {
      await handleSignin({
        email: data.get("email"),
        password: data.get("password"),
      });
    } catch (error) {
      pushSnack({
        message: error.message,
        action: "error",
      });
    } finally {
      setLoading(false);
    }

    pushSnack({
      message: "Successfully logged in!",
      severity: "success",
    });
    setValidateInput("");
    handleCloseReset();
    navigate("/");
  };

  return (
    <Dialog open={open} handleClose={handleClose} fullScreen={fullScreen}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <DialogContentText
            variant="h3"
            color="primary"
            sx={{ fontWeight: "bold" }}
          >
            NUSMODDED
          </DialogContentText>
          <TextField
            id="email"
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
            id="password"
            name="password"
            label="Password"
            type="password"
            margin="dense"
            fullWidth
            required
            defaultValue={password}
            onChange={handlePasswordChange}
          />
          <Button size="small">Forgot password</Button>
          <Collapse in={!!validateInput}>
            <Alert severity="error">{validateInput}</Alert>
          </Collapse>
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" disabled={loading}>
            Login
          </Button>
          <Button onClick={handleCloseReset}>Cancel</Button>
        </DialogActions>
      </Box>
      {/* <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          m: 0,
          width: "fit-content",
          padding: 4,
          paddingBottom: 10,
          paddingTop: 8,
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Box>
              <Typography
                align="center"
                variant="h3"
                paddingLeft={2}
                paddingRight={2}
                color="primary"
              >
                NUSMODDED
              </Typography>
              <Typography
                align="center"
                variant="h5"
                paddingLeft={2}
                paddingRight={2}
                paddingBottom={2}
              >
                Login
              </Typography>
            </Box>
            <Stack></Stack>
            <Stack></Stack>
            <TextField
              label="Email"
              name="email"
              defaultValue={email}
              size="small"
              required
              onChange={handleEmailChange}
            />
            <Stack>
              <TextField
                type="password"
                label="Password"
                name="password"
                defaultValue={password}
                size="small"
                required
                onChange={handlePasswordChange}
              />
              <Link>
                <Typography variant="caption" paddingLeft={0.2}>
                  Forget Password?
                </Typography>
              </Link>
            </Stack>
            <Stack></Stack>
            <Stack direction="row" spacing={2} justifyContent="space-evenly">
              <Button variant="contained" autoFocus type="submit" size="large">
                Login
              </Button>
              <Button
                variant="outlined"
                onClick={handleCloseReset}
                size="large"
              >
                Cancel
              </Button>
            </Stack>
            <Typography color="primary.light">{validateInput}</Typography>
            <Stack></Stack>
          </Stack>
        </Box>
      </Card> */}
    </Dialog>
  );
}
