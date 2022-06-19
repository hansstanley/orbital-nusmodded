import { createContext, useContext, useEffect, useState } from "react";
import * as randomBytes from "randombytes";
import { supabase } from "../services";
import { useAccessToken } from "./access-token.provider";
import { useBackend } from "./backend.provider";

const defaultUser = {
  signedIn: false,
  id: undefined,
  username: undefined,
  email: undefined,
  avatarUrl: undefined,
};

const AuthSessionContext = createContext({
  signedIn: false,
  user: defaultUser,
  handleSignup: async ({ username, email, password }) => {},
  handleSignin: async ({ email, password }) => {},
  handleSignout: async () => {},
});

function AuthSessionProvider({ children }) {
  const [user, setUser] = useState(defaultUser);
  const [signedIn, setSignedIn] = useState(false);
  const { setAccessToken } = useAccessToken();
  const { makeRequest } = useBackend();

  useEffect(() => {
    setSignedIn(!!supabase.auth.user());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!supabase.auth.user());
    });
  }, []);

  useEffect(() => {
    async function getAccessToken() {
      const authToken = randomBytes(16).toString("hex");

      const { error } = await supabase
        .from("profiles")
        .update({ auth_token: authToken })
        .match({ id: user.id });
      if (error) throw error;

      const { status, data } = await makeRequest({
        method: "post",
        route: "/auth/login",
        data: {
          username: user.username,
          password: authToken,
        },
      });

      if (status === 200) setAccessToken(data.accessToken);
    }

    if (user.signedIn) getAccessToken();
  }, [user, setAccessToken, makeRequest]);

  const handleSignup = async ({ username, email, password }) => {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (user) {
      setSignedIn(true);

      const info = {
        id: user.id,
        username,
      };
      const { error, data } = await supabase.from("profiles").insert([info]);
      if (error) throw error;

      setUser({
        signedIn: true,
        id: user.id,
        email: email,
        username: data[0].username,
        avatarUrl: data[0].avatar_url,
      });

      return user;
    } else {
      throw new Error("Unable to sign up");
    }
  };

  const handleSignin = async ({ email, password }) => {
    const { user, error } = await supabase.auth.signIn({
      email,
      password,
    });
    if (error) throw error;

    if (user) {
      setSignedIn(true);
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", user.id)
        .single();
      if (error) throw error;

      if (data) {
        setUser({
          signedIn: true,
          id: data.id,
          username: data.username,
          email: email,
          avatarUrl: data.avatar_url,
        });
      }

      return user;
    } else {
      throw new Error("Unable to sign in");
    }
  };

  const handleSignout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthSessionContext.Provider
      value={{
        signedIn: signedIn,
        user,
        handleSignup,
        handleSignin,
        handleSignout,
      }}
    >
      {children}
    </AuthSessionContext.Provider>
  );
}

function useAuthSession() {
  const context = useContext(AuthSessionContext);
  if (!(context ?? false)) {
    throw new Error(
      "useAuthSession must be used within an AuthSessionProvider"
    );
  }

  return context;
}

export { AuthSessionProvider, useAuthSession };
