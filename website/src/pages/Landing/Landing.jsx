import { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Button,
  CircularProgress,
  Fab,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
  Zoom,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useAuthSession, useMod } from "../../providers";
import { ModuleBox } from "../../components/Mod";
import background from "../../res/wallpaper.jpg";
import { DIMENSIONS } from "../../utils/constants";

const PAGE_COUNT = 2;

export default function Landing() {
  const navigate = useNavigate();
  const { loading, isAuth } = useAuthSession();
  const parallax = useRef(null);

  const handleStart = () => {
    navigate(isAuth() ? "/roadmap" : "/signup");
  };

  const handleScrollToTop = () => parallax.current?.scrollTo(0);

  return (
    <>
      <Parallax
        ref={parallax}
        pages={PAGE_COUNT}
        enabled={!loading}
        style={{ top: 0, left: 0 }}
      >
        <ParallaxBackground />
        <ParallaxMods />
        <ParallaxTitle />
        <ParallaxDown
          loading={loading}
          onClick={() => parallax.current?.scrollTo(1)}
        />
        <ParallaxSlogan />
        <ParallaxLayer offset={1} speed={2} style={styles.centered}>
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
      <BackToTop show={true} onClick={handleScrollToTop} />
    </>
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
      <ParallaxLayer offset={0} speed={2} style={styles.centered}>
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
      <ParallaxLayer offset={0} speed={1.5} style={styles.centered}>
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

function ParallaxMods({ count = 10 }) {
  const { getModArray, getModInfo } = useMod();
  const [initial, setInitial] = useState(true);
  const [mods, setMods] = useState([]);

  const paddingTops = useMemo(
    () => [...Array(count).keys()].map(() => `${Math.random() * 40 + 30}%`),
    [count]
  );

  useEffect(() => {
    async function init() {
      setInitial(false);
      try {
        const allMods = await getModArray();
        const chosenMods = [...Array(count).keys()].map(
          () => allMods[Math.floor(Math.random() * allMods.length)]
        );
        setMods(chosenMods);
      } catch (error) {
        console.error(error);
      }
    }

    if (initial) init();
  }, [initial, count, getModArray, getModInfo]);

  return mods.length
    ? mods.map((mod, index) => (
        <ParallaxLayer
          key={index}
          offset={0.5}
          speed={Math.random() / 2 + 0.75}
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            paddingLeft: `calc(${(index * 100) / count}% - ${
              DIMENSIONS.BOX_WIDTH / 2
            }px)`,
            paddingTop: paddingTops[index],
          }}
        >
          <ModuleBox moduleCode={mod.moduleCode} />
        </ParallaxLayer>
      ))
    : null;
}

function BackToTop({ show = false, onClick = () => {} }) {
  return (
    <Zoom in={show}>
      <Tooltip title="Back to top">
        <Fab
          onClick={onClick}
          sx={{ position: "fixed", right: 32, bottom: 32 }}
        >
          <ArrowUpwardIcon />
        </Fab>
      </Tooltip>
    </Zoom>
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
