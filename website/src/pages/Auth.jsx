import {
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { supabase } from "../services";
import { ResponsiveStack } from "../components";
import { SnackbarContext } from "../contexts";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { pushSnack } = useContext(SnackbarContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email: email });
      if (error) throw error;
      pushSnack({
        message: "Check your email for the login link!",
        severity: "success",
      });
    } catch (error) {
      pushSnack({
        message: error.error_description || error.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
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
    </>
  );
}
