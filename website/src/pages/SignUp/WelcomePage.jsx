import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/roadmap");
  };

  return (
    <Stack spacing={2} sx={sx.main} my={8}>
      <Typography variant="h4" sx={sx.desktopTitle} color="primary">
        Welcome to
      </Typography>
      <Typography variant="h1" sx={sx.desktopTitle} color="primary">
        NUSMODDED
      </Typography>
      <Typography variant="h5" sx={sx.mobileTitle} color="primary">
        Welcome to
      </Typography>
      <Typography variant="h3" sx={sx.mobileTitle} color="primary">
        NUSMODDED
      </Typography>
      <Button variant="contained" onClick={handleStart}>
        Continue
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
    display: { md: "block", xs: "none" },
    fontWeight: "bold",
  },
  mobileTitle: {
    display: { md: "none", xs: "block" },
    fontWeight: "bold",
  },
};
