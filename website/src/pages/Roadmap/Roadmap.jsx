import { Typography } from "@mui/material";
import { useContext } from "react";
import { AuthSessionContext } from "../../contexts";
import ModuleStack from "./ModuleStack";

export default function Roadmap() {
  const { signedIn } = useContext(AuthSessionContext);
  return signedIn ? (
    <ModuleStack />
  ) : (
    <Typography variant="h6">Please log in.</Typography>
  );
}
