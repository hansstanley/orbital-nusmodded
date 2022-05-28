import { Box, Paper } from "@mui/material";
import { animated, useSpring } from "@react-spring/web";
import { useContext } from "react";
import { LandingContext } from "../contexts";
import { useWindowDimensions } from "../hooks";

const AnimatedBox = animated(Box);

export default function MainFrame(props) {
  const { children } = props;

  const { isLanding } = useContext(LandingContext);
  const { height } = useWindowDimensions();

  const styles = useSpring({
    height: isLanding ? height : height - 64,
    minWidth: "100%",
    y: isLanding ? 0 : 64,
  });

  return (
    <AnimatedBox sx={{ display: "flex", p: 2 }} style={styles}>
      <Paper
        elevation={5}
        sx={{
          display: "flex",
          flex: 1,
          p: 2,
          overflow: "auto",
        }}
      >
        {children}
      </Paper>
    </AnimatedBox>
  );
}
