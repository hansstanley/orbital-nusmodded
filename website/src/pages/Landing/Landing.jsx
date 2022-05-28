import { Button, Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthSessionContext, LandingContext } from "../../contexts";

export default function Landing() {
  const navigate = useNavigate();
  const { toggleLanding } = useContext(LandingContext);
  const { signedIn } = useContext(AuthSessionContext);

  const handleStart = () => {
    toggleLanding();
    navigate(signedIn ? "/roadmap" : "/login");
  };

  return (
    <Stack
      spacing={2}
      sx={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: "bold" }} color="primary">
        NUSMODDED
      </Typography>
      <Button variant="contained" onClick={handleStart}>
        {signedIn ? "Continue" : "Get started"}
      </Button>
    </Stack>
  );
}
