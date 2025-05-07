import { useCallback, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { getSession } from "../lib/sessionFunctions.ts";
import { ChatContext } from "../context/ChatContext.tsx";
import i18next from "i18next";
import { Confidence } from "../model/confidence.ts";
import CONFIDENCE from "../lib/confidenceConstants.ts";
import { messagesOverLowerLimit } from "../lib/confidenceAdapter.ts";
import { sendExtendSession } from "../lib/websocketFunctions.ts";
import { useAppStore } from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";

const LOW_BOUNDARY = [CONFIDENCE.LOW, CONFIDENCE.MEDIOCRE, CONFIDENCE.MEDIUM];
const HIGH_CONFIDENCE = [CONFIDENCE.HIGH, CONFIDENCE.OUTSTANDING];

/**
 * Used to fetch confidence every time the messages change.
 */
export default function useConfidence() {
  const {
    setMessages,
    messages,
    confidence,
    setConfidence,
    updatingConfidence,
    setUpdatingConfidence,
    currentMessage,
    setUpdatingExpectedNodes,
  } = useContext(AppContext);
  const {
    expectedNodes,
    messageLowerLimit,
    messageUpperLimit,
    displayedConfidenceLevelProceedWarning,
    setDisplayConfidenceLevelProceedWarning,
  } = useAppStore(useShallow((state) => ({ ...state })));
  const { reportUrl, socket } = useContext(ChatContext);

  const updateNodes = useCallback(
    (confidence: Confidence) => {
      const { rating } = confidence;
      const messagesLength = messages.length;
      if (
        currentMessage > 0 &&
        currentMessage + 1 === messagesLength &&
        !messages.some((message) => message.final_report) &&
        LOW_BOUNDARY.includes(rating) &&
        expectedNodes - 1 === messagesLength &&
        messagesOverLowerLimit(messages, messageLowerLimit) &&
        messagesLength < messageUpperLimit &&
        !displayedConfidenceLevelProceedWarning
      ) {
        setDisplayConfidenceLevelProceedWarning(true);
      }
    },
    [setUpdatingExpectedNodes, currentMessage, socket, messages],
  );

  function updateMessage(confidence: Confidence) {
    const message = messages[currentMessage];
    if (!!message) {
      message.confidence = confidence;
      setMessages([...messages]);
    }
  }

  useEffect(() => {
    if (!updatingConfidence) {
      const session = getSession();
      if (session && currentMessage > 0) {
        const message = messages[currentMessage];
        if (!message?.confidence) {
          setUpdatingConfidence(true);
          fetch(
            `${reportUrl}/confidence/${session.id}?language=${i18next.language}&step=${currentMessage}`,
          )
            .then((response) => response.json())
            .then((confidence) => {
              setConfidence(confidence);
              updateNodes(confidence);
              updateMessage(confidence);
            })
            .catch((error) => {
              console.error("Error fetching confidence", error);
            })
            .finally(() => {
              setUpdatingConfidence(false);
            });
        } else {
          setConfidence(message.confidence);
        }
      }
    }
  }, [messages, currentMessage]);

  useEffect(() => {
    if (confidence && HIGH_CONFIDENCE.includes(confidence?.rating)) {
      if (
        currentMessage + 1 >= messageLowerLimit &&
        messages &&
        messages.length &&
        !messages[messages.length - 1]?.final_report &&
        currentMessage === messages.length - 1 // Only do this when you are on the last message
      ) {
        // Shorten the session.
        sendExtendSession(socket.current, currentMessage + 1);
      }
    }
  }, [confidence, currentMessage, messageLowerLimit, messages]);
}
