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
    <Stack spacing={2} sx={sx.main}>
      <Typography variant="h1" sx={sx.desktopTitle} color="primary">
        NUSMODDED
      </Typography>
      <Typography variant="h3" sx={sx.mobileTitle} color="primary">
        NUSMODDED
      </Typography>
      <Button variant="contained" onClick={handleStart}>
        {signedIn ? "Continue" : "Get started"}
      </Button>
    </Stack>
  );
}

const sx = {
  main: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  desktopTitle: {
    display: { sm: "block", xs: "none" },
    fontWeight: "bold",
  },
  mobileTitle: {
    display: { sm: "none", xs: "block" },
    fontWeight: "bold",
  },
};