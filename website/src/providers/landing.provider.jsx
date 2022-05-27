import { useState } from "react";
import { LandingContext } from "../contexts";

export default function LandingProvider(props) {
  const { children } = props;

  const [landing, setLanding] = useState(true);

  const toggleLanding = () => {
    setLanding(!landing);
  };

  return (
    <LandingContext.Provider
      value={{
        isLanding: landing,
        toggleLanding: toggleLanding,
      }}
    >
      {children}
    </LandingContext.Provider>
  );
}
