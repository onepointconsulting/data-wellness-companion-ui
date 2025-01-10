import { useAppStore } from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext.tsx";
import {
  isCompletionPopupDisplayed,
  setCompletionPopupDisplayed,
} from "../lib/sessionFunctions.ts";
import { messagesOverLowerLimit } from "../lib/confidenceAdapter.ts";

export default function useShowCompletionPopup() {
  const { messages, currentMessage } = useContext(AppContext);
  const { setShowCompletionPopup, messageLowerLimit } = useAppStore(
    useShallow((state) => ({
      setShowCompletionPopup: state.setShowCompletionPopup,
      messageLowerLimit: state.messageLowerLimit,
    })),
  );

  useEffect(() => {
    if (
      messagesOverLowerLimit(messages, messageLowerLimit) &&
      !isCompletionPopupDisplayed()
    ) {
      setShowCompletionPopup(true);
      setCompletionPopupDisplayed(true);
    }
  }, [messages, currentMessage, messageLowerLimit]);
}
