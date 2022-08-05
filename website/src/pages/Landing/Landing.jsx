import { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Fab,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ReactPlayer from "react-player/youtube";
import { useAuthSession, useMod } from "../../providers";
import { ModuleBox } from "../../components/Mod";
import background from "../../res/wallpaper.jpg";

const PAGE_COUNT = 3;

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
        <ParallaxLayer // Sticky Back-to-top FAB
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
        <ParallaxDescription onNext={() => parallax.current?.scrollTo(2)} />
        <ParallaxDown
          loading={loading}
          onClick={() => parallax.current?.scrollTo(1)}
        />
        <ParallaxSlogan />
        <ParallaxLayer // Stick Get Started button
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            height: 128,
          }}
          sticky={{ start: 1.5, end: 2 }}
        >
          <ButtonGroup variant="contained" sx={{ mt: 10 }}>
            <Button
              color="warning"
              onClick={() => parallax.current?.scrollTo(1.5)}
            >
              Learn more
            </Button>
            <Button onClick={handleStart} endIcon={<ArrowForwardIcon />}>
              {isAuth() ? "To roadmap" : "Get started"}
            </Button>
          </ButtonGroup>
        </ParallaxLayer>
        <ParallaxVideo />
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
    <ParallaxLayer offset={1} speed={1} style={styles.centered}>
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
        variant="h5"
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

function ParallaxDescription({ onNext = () => {} }) {
  const para1 =
    "Entering university, a common issue " +
    "faced by many freshmen is planning out their module selection. " +
    "They may not know which modules their course requires them to take " +
    "or the criteria for taking them.";

  const para2 =
    "Our web app aims to help these freshmen plan out their modules " +
    "easier and better. They would be able to visualize a degree " +
    "roadmap that suits them while not having to worry about course " +
    "and module requirements.";

  return (
    <>
      <ParallaxLayer offset={1.75} speed={0.5} style={styles.centered}>
        <Stack spacing={2} alignItems="center" width="80%">
          <Card sx={{ width: "80%", alignSelf: "flex-start" }}>
            <CardContent>
              <Typography display={{ md: "block", xs: "none" }} variant="h6">
                {para1}
              </Typography>
              <Typography display={{ md: "none", xs: "block" }} variant="body1">
                {para1}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ width: "80%", alignSelf: "flex-end" }}>
            <CardContent>
              <Typography display={{ md: "block", xs: "none" }} variant="h6">
                {para2}
              </Typography>
              <Typography display={{ md: "none", xs: "block" }} variant="body1">
                {para2}
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </ParallaxLayer>
      <ParallaxLayer
        offset={1.95}
        speed={1}
        style={{ ...styles.centered, alignItems: "flex-end" }}
      >
        <Button
          variant="contained"
          endIcon={<ArrowDownwardIcon />}
          onClick={onNext}
        >
          View video walkthrough
        </Button>
      </ParallaxLayer>
    </>
  );
}

function ParallaxVideo() {
  return (
    <ParallaxLayer offset={2} speed={1} style={styles.centered}>
      <Card
        sx={{
          width: { xs: "80vw", md: "48vw" },
          height: { xs: "60vw", md: "32vw" },
        }}
      >
        <CardHeader subheader="NUSModded Walkthrough" />
        <ReactPlayer
          url={process.env.REACT_APP_WALKTHROUGH_URL}
          width="100%"
          height="100%"
          light
          controls
        />
      </Card>
    </ParallaxLayer>
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
