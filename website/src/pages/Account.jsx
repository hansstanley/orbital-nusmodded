import { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { supabase } from "../services";
import { AuthGuard, ResponsiveStack } from "../components";
import { useAccessToken, useAuthSession, useSnackbar } from "../providers";

export default function Account() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const { hasAccess } = useAccessToken();
  const { profile, updateProfile } = useAuthSession();
  const { pushSnack } = useSnackbar();

  useEffect(() => {
    if (hasAccess) {
      setUsername(profile.username);
      setAvatarUrl(profile.avatarUrl);
    }
  }, [profile, hasAccess]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const updates = {
        id: profile.id,
        username: username,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      await updateProfile(updates);

      pushSnack({
        message: "Profile updated!",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      pushSnack({
        message: error.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <ResponsiveStack>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Avatar
            src={avatarUrl}
            sx={{ height: 240, width: 240, bgcolor: "primary.main" }}
          />
        </Box>
        <Stack spacing={2}>
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            value={profile.email || "No email found"}
            disabled
          />
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            id="avatar"
            label="Avatar URL"
            variant="outlined"
            value={avatarUrl || ""}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
          <Button variant="contained" onClick={handleUpdate} disabled={loading}>
            Update profile
          </Button>
        </Stack>
      </ResponsiveStack>
    </AuthGuard>
  );
}
