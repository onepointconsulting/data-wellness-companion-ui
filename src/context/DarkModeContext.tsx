import { createContext, useEffect, useState } from "react";
import { Props } from "./commonModel.ts";

interface DarkState {
  dark: boolean;
  setDark: (dark: boolean) => void;
}

export const DarkModeContext = createContext<DarkState>({
  dark: true,
  setDark: (_) => {},
});

export const DarkModeContextProvider = ({ children }: Props) => {
  const [dark, setDarkState] = useState<boolean>(false);

  useEffect(() => {
    const isDark = window.localStorage["dark"] === "true";
    setDarkState(isDark);
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  const setDark = (value: boolean) => {
    setDarkState(value);
    window.localStorage["dark"] = value ? "true" : "false";
    if (value) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  return (
    <DarkModeContext.Provider value={{ dark, setDark }}>
      {children}
    </DarkModeContext.Provider>
  );
};
