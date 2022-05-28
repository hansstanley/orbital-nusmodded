import {
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { supabase } from "../services";
import { ResponsiveStack } from "../components";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email: email });
      if (error) throw error;
      setSent(true);
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSent = (event, reason) => {
    if (reason === "clickaway") return;

    setSent(false);
  };

  return (
    <>
      <ResponsiveStack>
        <Stack spacing={2} sx={{ display: "flex", flex: 1 }}>
          <Typography variant="body1">
            Sign in via magic link with your email
          </Typography>
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <Button
            variant="contained"
            disabled={email ? false : true}
            onClick={handleLogin}
          >
            {loading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Send magic link"
            )}
          </Button>
        </Stack>
        <Stack spacing={2} sx={{ display: "flex", flex: 2 }}>
          <Typography variant="h6">Other login options:</Typography>
          <Typography variant="body1">To be added...</Typography>
        </Stack>
      </ResponsiveStack>
      <Snackbar
        open={sent}
        autoHideDuration={5000}
        onClose={handleCloseSent}
        message="Check your email for the login link!"
        action={
          <IconButton size="small" onClick={handleCloseSent} color="inherit">
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
}
