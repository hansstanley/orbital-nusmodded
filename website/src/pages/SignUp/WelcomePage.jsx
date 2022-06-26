import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/roadmap");
  };

  return (
    <Stack marginTop={25} spacing={2} sx={sx.main}>
      <Typography position={"relative"} top = {25} variant="h4" sx={sx.desktopTitle} color="primary">
        WELCOME TO
      </Typography>
      <Typography variant="h1" sx={sx.desktopTitle} color="primary">
        NUSMODDED
      </Typography>
      <Typography position={"relative"} top = {25} variant="h4" sx={sx.mobileTitle} color="primary">
        WELCOME TO
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
    display: { sm: "block", xs: "none" },
    fontWeight: "bold",
  },
  mobileTitle: {
    display: { sm: "none", xs: "block" },
    fontWeight: "bold",
  },
};
