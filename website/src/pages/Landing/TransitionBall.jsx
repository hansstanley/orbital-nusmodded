import { Box, useTheme } from "@mui/material";
import { animated, easings, useSpring } from "@react-spring/web";

export default function TransitionBall({ enter = false, onRest = () => {} }) {
  const theme = useTheme();

  const { x } = useSpring({
    from: { x: 0 },
    x: enter ? 1 : 0,
    config: { duration: 1000, easing: easings.easeOutCubic },
    onRest,
  });

  const AnimatedBox = animated(Box);

  return enter ? (
    <AnimatedBox
      sx={{
        position: "absolute",
        width: "10vw",
        height: "10vw",
        bottom: "40vh",
        right: "45vw",
        border: 2,
        borderRadius: "5vw",
        borderColor: theme.palette.primary.light,
      }}
      style={{
        transform: x.to({
          range: [0, 0.5, 1],
          output: [
            "translateX(80vw) scale(1)",
            "translateX(0vw) scale(1)",
            "translateX(0vw) scale(16)",
          ],
        }),
        backgroundColor: x.to({
          range: [0, 0.5, 1],
          output: [
            theme.palette.primary.main,
            theme.palette.primary.main,
            theme.palette.background.default,
          ],
        }),
      }}
    />
  ) : null;
}
