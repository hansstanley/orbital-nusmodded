import { Button, Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LandingContext } from "../../contexts";

export default function Landing() {
  const navigate = useNavigate();
  const { toggleLanding } = useContext(LandingContext);

  const handleStart = () => {
    toggleLanding();
    navigate("/login");
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
        Get started
      </Button>
    </Stack>
  );
}
