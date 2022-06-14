import { useEffect, useState } from "react";
import { AuthSessionContext } from "../contexts";
import { supabase } from "../services";

export default function AuthSessionProvider(props) {
  const { children } = props;
  const [session, setSession] = useState(null);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setSession(supabase.auth.session());
    setSignedIn(!!supabase.auth.user());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setSignedIn(!!supabase.auth.user());
    });
  }, []);

  return (
    <AuthSessionContext.Provider
      value={{ session: session, signedIn: signedIn }}
    >
      {children}
    </AuthSessionContext.Provider>
  );
}
