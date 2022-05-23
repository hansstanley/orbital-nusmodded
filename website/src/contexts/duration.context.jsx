import { createContext } from "react";

const DurationContext = createContext(() => ({
  duration: "threeYears",
  toggleDuration: (event) => {},
}));

export default DurationContext;
