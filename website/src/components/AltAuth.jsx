import { Button, Divider, Stack, Typography } from "@mui/material";
import { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuthSession, useSnackbar } from "../providers";

export default function AltAuth({ onDone = () => {} }) {
  const { handleSigninWithGoogle } = useAuthSession();
  const { pushSnack } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setLoading(true);

    try {
      await handleSigninWithGoogle();
      onDone();
    } catch (error) {
      console.error(error);
      pushSnack({
        message: "Unable to sign in with Google.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={1} width="100%">
      <Divider>
        <Typography variant="caption">OR</Typography>
      </Divider>
      <Button
        variant="contained"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleAuth}
        disabled={loading}
      >
        Sign in with Google
      </Button>
    </Stack>
  );
}
