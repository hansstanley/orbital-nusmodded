import { createContext } from "react";

const AuthSessionContext = createContext({
  session: null,
  signedIn: false,
});

export default AuthSessionContext;
