import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import * as randomBytes from "randombytes";
import { supabase } from "../services";
import { useSnackbar } from "./snackbar.provider";
import { Profile } from "../models";
import { AUTH_EVENT, BACKEND_DOMAIN } from "../utils/constants";

const AuthSessionContext = createContext({
  loading: false,
  accessToken: null,
  profile: new Profile(),
  isAuth: () => false,
  isAdmin: () => false,
  handleSignup: async ({ username, email, password }) => {},
  handleSignin: async ({ email, password }) => {},
  handleSignout: async () => {},
  updateProfile: async ({ id, ...updates }) => new Profile(),
});

function AuthSessionProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [authEvent, setAuthEvent] = useState(null);
  const [user, setUser] = useState(supabase.auth.user());
  const [profile, setProfile] = useState(null);
  const [aud, setAud] = useState(false);
  const [admin, setAdmin] = useState(false);
  const { pushSnack } = useSnackbar();

  useEffect(() => {
    const newAud = !!user && !!accessToken;
    if (newAud !== aud) setAud(newAud);
  }, [aud, user, accessToken]);

  const isAuth = useCallback(() => aud, [aud]);

  const getAccessToken = async (userId, username) => {
    if (!userId || !username) return null;

    const authToken = randomBytes(16).toString("hex");

    const { error } = await supabase
      .from("profiles")
      .update({ auth_token: authToken }, { returning: "minimal" })
      .match({ id: userId });
    if (error) throw error;

    const { status, data } = await axios.post(
      "/auth/login",
      {
        username: username,
        password: authToken,
      },
      { baseURL: BACKEND_DOMAIN }
    );

    if (status === 200 && data) {
      setAccessToken(data.accessToken);
      return data.accessToken;
    } else {
      throw new Error(`Unable to retrieve access token for ${username}`);
    }
  };

  const getProfile = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("id", userId)
      .single();
    if (error) {
      console.error("getProfile", error);
      return null;
    }

    setAdmin(data.admin);

    const result = new Profile()
      .updateProperty("username", data.username)
      .updateProperty("avatarUrl", data.avatar_url)
      .updateProperty("roadmap", data.roadmap);
    return result;
  }, []);

  const isAdmin = useCallback(() => !!admin, [admin]);

  const createProfile = useCallback(async (userId, username) => {
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        username,
      })
      .single();
    if (error) throw error;

    const result = new Profile()
      .updateProperty("username", data.username)
      .updateProperty("avatarUrl", data.avatar_url)
      .updateProperty("roadmap", data.roadmap);
    return result;
  }, []);

  const updateProfile = async ({ id, ...updates }) => {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .match({ id })
      .single();
    if (error) throw error;

    const result = (profile || new Profile())
      .updateProperty("username", data.username)
      .updateProperty("avatarUrl", data.avatar_url)
      .updateProperty("roadmap", data.roadmap);

    setProfile(result);
    return result;
  };

  const handleSignup = async ({ username, email, password }) => {
    const { user, error } = await supabase.auth.signUp(
      {
        email,
        password,
      },
      { data: { username } }
    );
    if (error) throw error;
    if (user?.identities.length === 0) {
      // Dummy user returned
      throw new Error(`Email ${email} has already been registered!`);
    }
  };

  const handleSignin = async ({ email, password }) => {
    const { error } = await supabase.auth.signIn({
      email,
      password,
    });
    if (error) throw error;
  };

  const handleSignout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setAuthEvent(event);

      switch (event) {
        case AUTH_EVENT.SIGNED_IN:
        case AUTH_EVENT.USER_UPDATED:
          setUser(supabase.auth.user());
          break;
        case AUTH_EVENT.SIGNED_OUT:
        case AUTH_EVENT.USER_DELETED:
          setUser(null);
          break;
        default:
      }
    });
  }, []);

  useEffect(() => {
    switch (authEvent) {
      case AUTH_EVENT.SIGNED_IN:
        pushSnack({
          message: `Signed in!`,
          severity: "success",
        });
        break;
      case AUTH_EVENT.SIGNED_OUT:
        pushSnack({
          message: `Goodbye!`,
          severity: "info",
        });
        break;
      default:
    }
  }, [authEvent, pushSnack]);

  useEffect(() => {
    async function init() {
      if (user) {
        setLoading(true);

        let userProfile = await getProfile(user.id);
        if (!userProfile) {
          userProfile = await createProfile(
            user.id,
            user.user_metadata.username
          );
        }
        userProfile = userProfile
          .updateProperty("id", user.id)
          .updateProperty("email", user.email);
        setProfile(userProfile);

        try {
          await getAccessToken(user.id, userProfile.username);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setAccessToken(null);
        setProfile(null);
        setLoading(false);
      }
    }

    init();
  }, [user, createProfile, getProfile]);

  const value = {
    loading,
    accessToken,
    profile,
    isAuth,
    isAdmin,
    handleSignup,
    handleSignin,
    handleSignout,
    updateProfile,
  };

  return (
    <AuthSessionContext.Provider value={value}>
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
