import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AppTitle() {
  const navigate = useNavigate();
  return (
    <Button>
      <Typography onClick={() => {
        navigate("");
      }}
        variant="h5"
        color={"primary"}
        noWrap
        sx={{ fontWeight: "bold" }}
      >
        NUSMODDED
      </Typography>
    </Button>
  );
}
