import {
  googleLogout,
  OverridableTokenClientConfig,
  TokenResponse,
  useGoogleLogin,
} from "@react-oauth/google";
import { createContext, useEffect, useState } from "react";
import { Props } from "./commonModel.ts";

interface UserState {
  user?: TokenResponse;
  setUser: (user: TokenResponse) => void;
  profile: object | null;
  setProfile: (profile: object) => void;
  logOut: () => void;
  login: (overrideConfig?: OverridableTokenClientConfig) => void;
}

export const AuthenticationContext = createContext<UserState>({
  profile: null,
  setUser: (_) => {},
  setProfile: (_) => {},
  logOut: () => {},
  login: (_?: OverridableTokenClientConfig) => {},
});

export const AuthenticationContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<TokenResponse>();
  const [profile, setProfile] = useState<object | null>(null);
  const login: (overrideConfig?: OverridableTokenClientConfig) => void =
    useGoogleLogin({
      onSuccess: (
        codeResponse: Omit<
          TokenResponse,
          "error" | "error_description" | "error_uri"
        >,
      ) => {
        setUser(codeResponse);
      },
      onError: (error) => console.log("Login Failed:", error),
    });
  useEffect(() => {
    if (user) {
      fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: "application/json",
          },
        },
      )
        .then((res) => res.json())
        .then((res) => setProfile(res))
        .catch((err) => console.log(err));
    }
  }, [user]);
  const logOut = () => {
    googleLogout();
    setProfile(null);
  };
  return (
    <AuthenticationContext.Provider
      value={{ user, setUser, profile, setProfile, login, logOut }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
