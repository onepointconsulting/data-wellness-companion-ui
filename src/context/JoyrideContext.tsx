import { createContext, RefObject, useRef } from "react";
import { Props } from "./commonModel.ts";

export type JoyrideState = {
  questionRef: RefObject<HTMLDivElement> | null;
  hamburgerMenu: RefObject<HTMLDivElement> | null;
  navbarRef: RefObject<HTMLDivElement> | null;
};

export const JoyrideContext = createContext<JoyrideState>({
  questionRef: null,
  hamburgerMenu: null,
  navbarRef: null,
});

export default function JoyrideContextProvider({ children }: Props) {
  const hamburgerMenu: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const questionRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const navbarRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

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
