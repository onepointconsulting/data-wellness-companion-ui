import { useContext } from "react";
import { AppContext } from "../context/AppContext.tsx";
import onCloseDialogue from "../lib/dialogFunctions.ts";
import { forgetSeenIntro } from "../lib/sessionFunctions.ts";
import { INFO_DIALOGUE_ID } from "../components/dialogue/InfoDialogue.tsx";

export default function useShowIntroDialogue() {
  const { setSeenIntro } = useContext(AppContext);
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
