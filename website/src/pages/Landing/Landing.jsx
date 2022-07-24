import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoadingGuard } from "../../components";
import { useAuthSession } from "../../providers";

export default function Landing() {
  const navigate = useNavigate();
  const { loading, isAuth } = useAuthSession();

  const handleStart = () => {
    navigate(isAuth() ? "/roadmap" : "/signup");
  };

  return (
    <LoadingGuard loading={loading}>
      <Stack spacing={2} sx={sx.main}>
        <Typography variant="h1" sx={sx.desktopTitle} color="primary">
          NUSMODDED
        </Typography>
        <Typography variant="h3" sx={sx.mobileTitle} color="primary">
          NUSMODDED
        </Typography>
        <Button variant="contained" onClick={handleStart}>
          {isAuth() ? "Continue" : "Get started"}
        </Button>
      </Stack>
    </LoadingGuard>
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
