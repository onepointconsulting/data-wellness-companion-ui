import {
  googleLogout,
  OverridableTokenClientConfig,
  TokenResponse,
  useGoogleLogin,
} from "@react-oauth/google";
import { createContext, useEffect, useState } from "react";
import { Props } from "./commonModel.ts";
import {
  removeAccessToken,
  setAccessToken,
} from "../lib/accessTokenPersistence.ts";

interface UserState {
  user?: TokenResponse;
  setUser: (user: TokenResponse) => void;
  profile: object | null;
  setProfile: (profile: object) => void;
  logout: () => void;
  login: (overrideConfig?: OverridableTokenClientConfig) => void;
}

export const AuthenticationContext = createContext<UserState>({
  profile: null,
  setUser: (_) => {},
  setProfile: (_) => {},
  logout: () => {},
  login: (_?: OverridableTokenClientConfig) => {},
});

async function handleUserLogin(
  user: TokenResponse,
  setProfile: (profile: object) => void,
): Promise<void> {
  try {
    // Call backend login endpoint
    const loginResponse = await fetch(
      `${window.dataWellnessConfig.reportUrl}/admin/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: user.access_token,
        }),
      },
    );
    const loginResult = await loginResponse.json();
    setAccessToken(loginResult.access_token);

    // Fetch user info from Google
    const userInfoResponse = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          Accept: "application/json",
        },
      },
    );
    const userInfo = await userInfoResponse.json();
    setProfile(userInfo);
  } catch (err) {
    console.log("Login error:", err);
  }
}

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
      handleUserLogin(user, setProfile);
    }
  }, [user]);
  const logout = () => {
    googleLogout();
    setProfile(null);
    removeAccessToken();
  };
  return (
    <AuthenticationContext.Provider
      value={{ user, setUser, profile, setProfile, login, logout }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
