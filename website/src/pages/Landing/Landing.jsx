import { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Fab,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useAuthSession, useMod } from "../../providers";
import { ModuleBox } from "../../components/Mod";
import background from "../../res/wallpaper.jpg";

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
        <ParallaxLayer // Back-to-top FAB
          sticky={{ start: 0.5, end: PAGE_COUNT - 1 }}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            width: `${128}px`,
            marginLeft: `calc(100% - ${128}px)`,
            paddingRight: 32,
            paddingBottom: 32,
          }}
        >
          <Tooltip title="Back to top">
            <Fab onClick={handleScrollToTop}>
              <ArrowUpwardIcon />
            </Fab>
          </Tooltip>
        </ParallaxLayer>
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
        factor={PAGE_COUNT}
        style={{ backgroundColor: "black" }}
      />
      <ParallaxLayer
        offset={0}
        speed={0}
        factor={PAGE_COUNT}
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

function ParallaxMods() {
  const { getModArray } = useMod();
  const [allMods, setAllMods] = useState([]);

  const MOD_COUNT = 10;

  useEffect(() => {
    async function init() {
      try {
        const data = await getModArray();
        setAllMods(data);
      } catch (error) {
        console.error(error);
      }
    }

    init();
  }, [getModArray]);

  const visibleMods = useMemo(
    () =>
      allMods.length
        ? [...Array(MOD_COUNT).keys()].map(
            () => allMods[Math.floor(Math.random() * allMods.length)]
          )
        : [],
    [allMods]
  );

  const offsets = useMemo(
    () => [...Array(MOD_COUNT).keys()].map(() => Math.random() * 0.4 + 0.6),
    []
  );

  const speeds = useMemo(
    () => [...Array(MOD_COUNT).keys()].map(() => Math.random() * 0.8 + 0.6),
    []
  );

  const getML = (index) =>
    index < MOD_COUNT / 2
      ? 0
      : `${(100 / MOD_COUNT) * (index - MOD_COUNT / 2) * 2}%`;
  const getMR = (index) =>
    index < MOD_COUNT / 2 ? `${(100 / MOD_COUNT) * index * 2}%` : 0;

  return visibleMods.map((mod, index) =>
    mod?.moduleCode ? (
      <ParallaxLayer
        key={index}
        offset={offsets[index]}
        speed={speeds[index]}
        style={styles.centered}
      >
        <Box sx={{ ml: getML(index), mr: getMR(index) }}>
          <ModuleBox moduleCode={mod.moduleCode} />
        </Box>
      </ParallaxLayer>
    ) : null
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
