import { createContext, RefObject, useRef } from "react";
import { Props } from "./commonModel.ts";

export type JoyrideState = {
  questionRef: RefObject<HTMLDivElement | null> | null;
  hamburgerMenu: RefObject<HTMLDivElement | null> | null;
  navbarRef: RefObject<HTMLDivElement | null> | null;
};

export const JoyrideContext = createContext<JoyrideState>({
  questionRef: null,
  hamburgerMenu: null,
  navbarRef: null,
});

export default function JoyrideContextProvider({ children }: Props) {
  const hamburgerMenu = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

  return (
    <JoyrideContext.Provider
      value={{
        questionRef,
        hamburgerMenu,
        navbarRef,
      }}
    >
      {children}
    </JoyrideContext.Provider>
  );
}
