import { useAppStore } from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext.tsx";
import {
  isCompletionPopupDisplayed,
  setCompletionPopupDisplayed,
} from "../lib/sessionFunctions.ts";
import { messagesOverLowerLimit } from "../lib/confidenceAdapter.ts";

export default function useShowCompletionDialogue() {
  const { messages, isReport, currentMessage } = useContext(AppContext);
  const { setShowCompletionPopup, messageLowerLimit } = useAppStore(
    useShallow((state) => ({
      setShowCompletionPopup: state.setShowCompletionPopup,
      messageLowerLimit: state.messageLowerLimit,
    })),
  );

  useEffect(() => {
    if (isReport) {
      setCompletionPopupDisplayed(true);
    }
    if (
      messagesOverLowerLimit(messages, messageLowerLimit) &&
      !isCompletionPopupDisplayed()
    ) {
      setShowCompletionPopup(true);
    }
  }, [messages, currentMessage, messageLowerLimit, isReport]);
}
