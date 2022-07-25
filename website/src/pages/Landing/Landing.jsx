import { useRef } from "react";
import {
  Avatar,
  Button,
  CircularProgress,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useAuthSession } from "../../providers";
import background from "../../res/wallpaper.jpg";

export default function Landing() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { loading, isAuth } = useAuthSession();
  const parallax = useRef(null);

  const handleStart = () => {
    navigate(isAuth() ? "/roadmap" : "/signup");
  };

  const handleScrollUp = () => parallax.current.scrollTo(0);
  const handleScrollDown = () => parallax.current.scrollTo(1);

  return (
    <Parallax
      ref={parallax}
      pages={2}
      enabled={!loading}
      style={{ top: 0, left: 0 }}
    >
      <ParallaxLayer
        offset={0}
        speed={0}
        factor={2}
        style={{ backgroundColor: "black" }}
      />
      <ParallaxLayer
        offset={0}
        speed={0}
        factor={2}
        style={{
          opacity: theme.palette.mode === "light" ? "100%" : "90%",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
        }}
      />
      <ParallaxLayer offset={0} speed={2} style={styles.centered}>
        <Typography
          display={sx.desktopTitle.display}
          variant="h1"
          color="primary"
          fontWeight="bold"
        >
          NUSMODDED
        </Typography>
        <Typography
          display={sx.mobileTitle.display}
          variant="h3"
          color="primary"
          fontWeight="bold"
        >
          NUSMODDED
        </Typography>
      </ParallaxLayer>
      <ParallaxLayer offset={0} speed={0.5} style={styles.centered}>
        <IconButton
          disabled={loading}
          onClick={handleScrollDown}
          sx={{ mt: 20 }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              <ArrowDownwardIcon />
            </Avatar>
          )}
        </IconButton>
      </ParallaxLayer>
      <ParallaxLayer
        offset={1}
        speed={0.5}
        onClick={handleScrollUp}
        style={styles.centered}
      >
        <Typography
          display={sx.desktopTitle.display}
          variant="h3"
          fontWeight="bold"
          color="white"
          mx={4}
        >
          Your module roadmap planner.
        </Typography>
        <Typography
          display={sx.mobileTitle.display}
          variant="h4"
          fontWeight="bold"
          color="white"
          mx={4}
        >
          Your module roadmap planner.
        </Typography>
      </ParallaxLayer>
      <ParallaxLayer
        offset={1}
        speed={2}
        onClick={handleScrollUp}
        style={styles.centered}
      >
        <Button
          variant="contained"
          onClick={handleStart}
          endIcon={<ArrowForwardIcon />}
          sx={{ mt: 20 }}
        >
          {isAuth() ? "To roadmap" : "Get started"}
        </Button>
      </ParallaxLayer>
    </Parallax>
  );
}

const sx = {
  desktopTitle: {
    display: { sm: "block", xs: "none" },
  },
  mobileTitle: {
    display: { sm: "none", xs: "block" },
  },
};

const styles = {
  centered: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
