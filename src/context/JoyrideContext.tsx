import { createContext, RefObject, useRef } from "react";
import { Props } from "./commonModel.ts";

export type JoyrideState = {
  chatInputRef: RefObject<HTMLDivElement> | null;
  questionRef: RefObject<HTMLDivElement> | null;
  hamburgerMenu: RefObject<HTMLDivElement> | null;
  navbarRef: RefObject<HTMLDivElement> | null;
    sendButtonRef: RefObject<HTMLButtonElement> | null;
};

export const JoyrideContext = createContext<JoyrideState>({
  questionRef: null,
  chatInputRef: null,
  hamburgerMenu: null,
  navbarRef: null,
    sendButtonRef: null
});

export default function JoyrideContextProvider({ children }: Props) {
  const hamburgerMenu: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const chatInputRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const questionRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const navbarRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const sendButtonRef: RefObject<HTMLButtonElement> = useRef<HTMLButtonElement>(null);

  return (
    <JoyrideContext.Provider
      value={{
        chatInputRef,
        questionRef,
        hamburgerMenu,
        navbarRef,
          sendButtonRef
      }}
    >
      {children}
    </JoyrideContext.Provider>
  );
}
