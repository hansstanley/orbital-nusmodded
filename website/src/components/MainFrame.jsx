import { Box, Paper, Toolbar } from "@mui/material";
import { animated, useSpring } from "@react-spring/web";
import { useContext } from "react";
import { LandingContext } from "../contexts";
import { useWindowDimensions } from "../hooks";

const AnimatedBox = animated(Box);

export default function MainFrame(props) {
  const { children } = props;

  const { isLanding } = useContext(LandingContext);
  const { height } = useWindowDimensions();

  // const styles = useSpring({
  //   height: isLanding ? height : height - 64,
  //   minWidth: "100%",
  //   y: isLanding ? 0 : 64,
  // });

  return (
    <Box component="main" sx={{ p: 2, height: "100vh", width: "100vw" }}>
      <Toolbar />
      <Paper
        elevation={5}
        sx={{
          display: "flex",
          flex: 1,
          height: "calc(100% - 64px)",
          p: 2,
          overflow: "auto",
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}
