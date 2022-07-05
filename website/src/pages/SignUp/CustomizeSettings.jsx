import * as React from "react";
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Card,
  Stack,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { supabase } from "../../services";
import Settings from "../Settings";
import { useAuthSession } from "../../providers";

export default function CustomizeSettings({ handleNext }) {
  const { isAuth } = useAuthSession();
  return (
    isAuth() ? <>
    <Stack sx={{ display: "flex", flex: 1, margin: 2 }}>
      <Stack marginTop={8} alignItems='center'>
        <Settings />
        <Button
          variant="contained"
          sx={{ mt: 20, width: 300 }}
          onClick = {handleNext}
        >
          Next
        </Button>
      </Stack>
    </Stack>
    </> : <>
      <Stack sx={{ display: "flex", flex: 1, margin: 2 }} alignItems='center'>
        <Typography variant="h4" marginTop={8}>Please confirm your email address and return to this page!</Typography>
      </Stack>
    </>
  );
}
