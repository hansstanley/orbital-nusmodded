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

export default function CustomizeSettings({ handleNext }) {
  return (
    <>
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
    </>
  );
}
