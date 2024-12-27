import onCloseDialogue from "../lib/dialogFunctions.ts";
import { forgetSeenIntro } from "../lib/sessionFunctions.ts";
import { INFO_DIALOGUE_ID } from "../components/dialogue/InfoDialogue.tsx";
import { useAppStore } from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";

export default function useShowIntroDialogue() {
  const { setSeenIntro } = useAppStore(
    useShallow((state) => ({ setSeenIntro: state.setSeenIntro })),
  );
  function showIntroDialogue(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) {
    event.preventDefault();
    onCloseDialogue(INFO_DIALOGUE_ID);
    setSeenIntro(false);
    forgetSeenIntro();
  }
  return showIntroDialogue;
}
