import { Button, Stack, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthSessionContext } from "../contexts";
import { supabase } from "../services";

export default function Account() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const { session } = useContext(AuthSessionContext);

  useEffect(() => {
    getProfile();
  }, [session]);

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

  return (
    <Stack spacing={2}>
      <TextField id="email" label="Email" variant="outlined" disabled />
      <TextField
        id="username"
        label="Username"
        variant="outlined"
        value={username || ""}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button variant="contained" onClick={updateProfile} disabled={loading}>
        Update profile
      </Button>
    </Stack>
  );
}
