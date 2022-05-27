import { createContext } from "react";

const LandingContext = createContext({
  isLanding: true,
  toggleLanding: () => {},
});

export default LandingContext;
