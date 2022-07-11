import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { LandingContext } from "../contexts";

export default function LandingProvider({ children }) {
  const location = useLocation();
  const [landing, setLanding] = useState(true);

  useEffect(() => {
    setLanding(location.pathname === "/");
  }, [location]);

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
