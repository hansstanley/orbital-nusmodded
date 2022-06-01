import React from "react";
import { DurationContext } from "../contexts";

export default function DurationContextProvider({ children }) {
  const [duration, setDuration] = React.useState("threeYears");

  const toggleDuration = (event) => {
    console.log("hi");
    console.log(event.target.value);
    setDuration(event.target.value);
  };

  return (
    <DurationContext.Provider
      value={{
        duration: duration,
        toggleDuration: toggleDuration,
      }}
    >
      {children}
    </DurationContext.Provider>
  );
}
