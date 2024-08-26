import {useContext} from "react";
import {AppContext} from "../context/AppContext.tsx";
import {hasSeenIntro} from "../lib/sessionFunctions.ts";

export function useSeenIntroHook() {
  const { setSeenIntro } = useContext(AppContext);
  function setSeenIntroHook() {
    hasSeenIntro();
    setSeenIntro(true);
  }

  return { setSeenIntroHook };
}