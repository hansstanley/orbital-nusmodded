import { IconButton, Tooltip } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { animated, easings, useSpring } from "@react-spring/web";

export default function LockButton({ locked = false, onToggle = () => {} }) {
  const { x } = useSpring({
    from: { x: 0 },
    x: locked ? 1 : 0,
    config: {
      duration: 2000,
      easing: easings.easeOutElastic,
    },
  });

  const AnimatedIconButton = animated(IconButton);

  return (
    <Tooltip title={locked ? "Click to unlock" : "Click to lock"}>
      <AnimatedIconButton
        onClick={onToggle}
        style={{
          rotate: x.to({
            range: [0, 1],
            output: ["45deg", "0deg"],
          }),
        }}
      >
        {locked ? <LockIcon /> : <LockOpenIcon />}
      </AnimatedIconButton>
    </Tooltip>
  );
}
