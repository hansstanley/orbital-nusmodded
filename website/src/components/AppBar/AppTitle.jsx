import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LandingContext } from "../../contexts";

export default function AppTitle() {
  const navigate = useNavigate();
  return (
    <LandingContext.Consumer>
      {({ toggleLanding }) => (
        <Button
          onClick={() => {
            navigate("/");
            toggleLanding();
          }}
        >
          <Typography
            variant="h5"
            color={"primary"}
            noWrap
            sx={{ fontWeight: "bold" }}
          >
            NUSMODDED
          </Typography>
        </Button>
      )}
    </LandingContext.Consumer>
  );
}
