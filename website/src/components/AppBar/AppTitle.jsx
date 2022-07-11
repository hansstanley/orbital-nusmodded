import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDrawer } from "../../providers";

/**
 * Button title that establishes the identity of the app.
 *
 * @returns A button that navigates to the root page.
 */
export default function AppTitle() {
  const navigate = useNavigate();
  const { drawerOpen, handleDrawerToggle } = useDrawer();

  const handleClick = () => {
    if (drawerOpen) handleDrawerToggle();
    navigate("/");
  };

  return (
    <Button onClick={handleClick}>
      <Typography
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
