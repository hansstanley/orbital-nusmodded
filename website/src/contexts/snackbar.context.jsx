import { createContext } from "react";

const SnackbarContext = createContext({
  pushSnack: ({ message, severity, action }) => {},
});

export default SnackbarContext;
