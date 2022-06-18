import * as React from "react";
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Card,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { supabase } from "../../services";
import Settings from "../Settings";

export default function CustomizeSettings() {
  return (
    <Box sx={{ display: "flex", flex: 1, margin: 2 }}>
      <Settings />
    </Box>
  );
}
