import { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AuthSessionContext } from "../contexts";
import { supabase } from "../services";
import { ResponsiveStack } from "../components";

export default function Account() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const { session, signedIn } = useContext(AuthSessionContext);

  useEffect(() => {
    if (signedIn) getProfile();
  }, [signedIn]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user.id,
        username: username,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      let { error } = await supabase
        .from("profiles")
        .upsert(updates, { returning: "minimal" });

      if (error) throw error;
      alert("Updated profile!");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return signedIn ? (
    <ResponsiveStack>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Avatar
          alt={username || session.user.email}
          src={avatarUrl}
          sx={{ height: 240, width: 240, bgcolor: "primary.main" }}
        />
      </Box>
      <Stack spacing={2}>
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          value={session.user.email}
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
        <Button variant="contained" onClick={updateProfile} disabled={loading}>
          Update profile
        </Button>
      </Stack>
    </ResponsiveStack>
  ) : (
    <Typography variant="h6">Please log in.</Typography>
  );
}
