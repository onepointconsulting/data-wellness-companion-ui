import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { showDialogue } from "../lib/dialogFunctions.ts";
import { RESTART_DIALOGUE_ID } from "../components/dialogue/RestartDialogue.tsx";
import { toast } from "../../@/components/ui/use-toast.ts";

export default function useShowStartDialogue() {
  const { t } = useTranslation();
  const { connected } = useContext(AppContext);

  function showStartDialogue() {
    showDialogue(RESTART_DIALOGUE_ID);
  }

  function processPopup() {
    return !connected
      ? () => {
          toast({
            title: t("You are disconnected."),
            description: t(
              "You are disconnected. The Data Wellness Companion needs to be connected to restart.",
            ),
          });
        }
      : showStartDialogue;
  }

  return { processPopup };
}
