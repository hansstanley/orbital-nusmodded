import React from "react";

const LightModeContext = React.createContext({
  isLightMode: true,
  toggleLightMode: () => {},
});

export default LightModeContext;
