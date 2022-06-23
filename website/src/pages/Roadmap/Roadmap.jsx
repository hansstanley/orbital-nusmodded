import { Box, Paper, Typography } from "@mui/material";
import { useContext, useEffect, useRef } from "react";
import ModuleStack from "./ModuleStack";
import { ModuleStack as ModStack } from "../../components/Mod";
import { ResponsiveStack } from "../../components";

export default function Roadmap() {
  const modStack = useRef(null);

  return (
    <ResponsiveStack>
      <Paper sx={{ p: 2, position: "sticky", top: 0, left: 0, zIndex: 3000 }}>
        <ModStack />
      </Paper>
      <ModuleStack />
    </ResponsiveStack>
  );
}
