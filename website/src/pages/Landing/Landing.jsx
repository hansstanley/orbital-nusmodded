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
      <ParallaxBackground />
      <ParallaxTitle />
      <ParallaxDown loading={loading} onClick={handleScrollDown} />
      <ParallaxSlogan />
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

function ParallaxBackground() {
  const theme = useTheme();

  return (
    <>
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
    </>
  );
}

function ParallaxTitle() {
  const theme = useTheme();

  return (
    <>
      <ParallaxLayer offset={0} speed={2.5} style={styles.centered}>
        <Typography
          position="absolute"
          display={sx.desktopTitle.display}
          variant="h1"
          color="black"
          fontWeight="bold"
          ml={1}
          mt={1}
        >
          NUSMODDED
        </Typography>
        <Typography
          position="absolute"
          display={sx.mobileTitle.display}
          variant="h3"
          color="black"
          fontWeight="bold"
          ml={1}
          mt={1}
        >
          NUSMODDED
        </Typography>
      </ParallaxLayer>
      <ParallaxLayer offset={0} speed={2} style={styles.centered}>
        <Typography
          position="absolute"
          display={sx.desktopTitle.display}
          variant="h1"
          color="primary"
          fontWeight="bold"
        >
          NUSMODDED
        </Typography>
        <Typography
          position="absolute"
          display={sx.mobileTitle.display}
          variant="h3"
          color="primary"
          fontWeight="bold"
        >
          NUSMODDED
        </Typography>
      </ParallaxLayer>
    </>
  );
}

function ParallaxSlogan() {
  return (
    <ParallaxLayer offset={1} speed={0.5} style={styles.centered}>
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
  );
}

function ParallaxDown({ onClick = () => {}, loading = false }) {
  const theme = useTheme();

  return (
    <>
      <ParallaxLayer offset={0} speed={1} style={styles.centered}>
        <IconButton disabled sx={{ mt: 20.8, ml: 0.8 }}>
          {loading ? (
            <CircularProgress sx={{ color: "black" }} />
          ) : (
            <Avatar sx={{ bgcolor: "black" }}>
              <ArrowDownwardIcon sx={{ color: "white" }} />
            </Avatar>
          )}
        </IconButton>
      </ParallaxLayer>
      <ParallaxLayer offset={0} speed={0.5} style={styles.centered}>
        <IconButton disabled={loading} onClick={onClick} sx={{ mt: 20 }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              <ArrowDownwardIcon sx={{ color: "white" }} />
            </Avatar>
          )}
        </IconButton>
      </ParallaxLayer>
    </>
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
