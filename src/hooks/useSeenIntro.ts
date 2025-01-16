import { useContext, useEffect } from "react";
import { getSeenIntro, hasSeenIntro } from "../lib/sessionFunctions.ts";
import { useAppStore } from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import { AppContext } from "../context/AppContext.tsx";

export default function useSeenIntro() {
  const { setStartSession } = useContext(AppContext);
  const { seenIntro, setSeenIntro } = useAppStore(
    useShallow((state) => ({
      seenIntro: state.seenIntro,
      setSeenIntro: state.setSeenIntro,
    })),
  );

  useEffect(() => {
    if (seenIntro) {
      hasSeenIntro();
    }
  }, [seenIntro]);

  useEffect(() => {
    setStartSession(true);
    setSeenIntro(getSeenIntro());
  }, []);
}
