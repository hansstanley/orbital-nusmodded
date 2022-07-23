import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { AuthGuard, ResponsiveStack } from "../components";
import { useAuthSession, useSnackbar } from "../providers";

export default function Account() {
  const { profile, updateProfile } = useAuthSession();
  const { pushSnack } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (profile) {
      setEmail(profile.email);
      setUsername(profile.username);
      setAvatarUrl(profile.avatarUrl);
    }
  }, [profile]);

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

  const handleAvatarClick = () => setHighlight((prev) => !prev);

  return (
    <AuthGuard>
      <ResponsiveStack>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Tooltip title="Change avatar">
            <IconButton onClick={handleAvatarClick}>
              <Avatar
                src={avatarUrl}
                sx={{ height: 240, width: 240, bgcolor: "primary.main" }}
              />
            </IconButton>
          </Tooltip>
        </Box>
        <Card sx={{ flex: 1 }}>
          <CardContent
            sx={{ display: "flex", flex: 1, justifyContent: "center" }}
          >
            <Stack
              spacing={2}
              width={{ xs: "100%", sm: "80%" }}
              alignItems="flex-start"
            >
              <TextField
                label="Email"
                variant="outlined"
                value={email || "No email found"}
                fullWidth
                disabled
              />
              <TextField
                label="Username"
                variant="outlined"
                value={username || ""}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
              />
              <Stack direction="row" alignItems="center" width="100%">
                <Collapse in={highlight} orientation="horizontal" unmountOnExit>
                  <Avatar sx={{ bgcolor: "green", mr: 2 }}>
                    <ArrowForwardIcon />
                  </Avatar>
                </Collapse>
                <TextField
                  label="Avatar URL"
                  variant="outlined"
                  value={avatarUrl || ""}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  fullWidth
                />
              </Stack>
              <Button
                variant="contained"
                onClick={handleUpdate}
                disabled={loading}
              >
                Update profile
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </ResponsiveStack>
    </AuthGuard>
  );
}
