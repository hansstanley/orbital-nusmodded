import { createContext, useContext, useState } from "react";
import * as randomBytes from "randombytes";
import { supabase } from "../services";
import { useAccessToken } from "./access-token.provider";
import { useBackend } from "./backend.provider";
import { useSnackbar } from "./snackbar.provider";
import { Profile } from "../models";

const AuthSessionContext = createContext({
  profile: new Profile(),
  handleSignup: async ({ username, email, password }) => {},
  handleSignin: async ({ email, password }) => {},
  handleSignout: async () => {},
  updateProfile: async ({ id, ...updates }) => new Profile(),
});

function AuthSessionProvider({ children }) {
  const [profile, setProfile] = useState(new Profile());
  const { setAccessToken, clearAccessToken } = useAccessToken();
  const { makeRequest } = useBackend();
  const { pushSnack } = useSnackbar();

  const getAccessToken = async (userId, username) => {
    const authToken = randomBytes(16).toString("hex");

    const { error } = await supabase
      .from("profiles")
      .update({ auth_token: authToken }, { returning: "minimal" })
      .match({ id: userId });
    if (error) throw error;

    const { status, data } = await makeRequest({
      method: "post",
      route: "/auth/login",
      data: {
        username: username,
        password: authToken,
      },
    });

    if (status === 200 && data) {
      setAccessToken(data.accessToken);
      return data.accessToken;
    } else {
      throw new Error(`Unable to retrieve access token for ${username}`);
    }
  };

  const getProfile = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("id", userId)
      .single();
    if (error) throw error;

    const result = profile
      .updateProperty("username", data.username)
      .updateProperty("avatarUrl", data.avatar_url);

    setProfile(result);
    return result;
  };

  const createProfile = async (userId, username) => {
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        username,
      })
      .single();
    if (error) throw error;

    const result = profile
      .updateProperty("username", data.username)
      .updateProperty("avatarUrl", data.avatar_url);

    setProfile(result);
    return result;
  };

  const updateProfile = async ({ id, ...updates }) => {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .match({ id })
      .single();
    if (error) throw error;

    const result = profile
      .updateProperty("username", data.username)
      .updateProperty("avatarUrl", data.avatar_url);

    setProfile(result);
    return result;
  };

  const handleSignup = async ({ username, email, password }) => {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    const result = (await createProfile(user.id, username))
      .updateProperty("id", user.id)
      .updateProperty("email", email);
    setProfile(result);

    await getAccessToken(result.id, result.username);
    pushSnack({
      message: `Email verification feature coming soon, ${result.username}`,
      severity: "info",
    });
  };

  const handleSignin = async ({ email, password }) => {
    const { user, error } = await supabase.auth.signIn({
      email,
      password,
    });
    if (error) throw error;

    const result = (await getProfile(user.id))
      .updateProperty("id", user.id)
      .updateProperty("email", email);
    setProfile(result);

    await getAccessToken(result.id, result.username);
    pushSnack({
      message: `Welcome, ${result.username}!`,
      severity: "success",
    });
  };

  const handleSignout = async () => {
    clearAccessToken();
    await supabase.auth.signOut();
    setProfile(new Profile());
    pushSnack({
      message: "Goodbye!",
      severity: "info",
    });
  };

  return (
    <AuthSessionContext.Provider
      value={{
        profile,
        handleSignup,
        handleSignin,
        handleSignout,
        updateProfile,
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
