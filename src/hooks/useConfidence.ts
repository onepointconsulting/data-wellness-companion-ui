import { useCallback, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { getSession } from "../lib/sessionFunctions.ts";
import { ChatContext } from "../context/ChatContext.tsx";
import i18next from "i18next";
import { Confidence } from "../model/confidence.ts";
import CONFIDENCE from "../lib/confidenceConstants.ts";
import { sendExtendSession } from "../lib/websocketFunctions.ts";

const LOW_BOUNDARY = [CONFIDENCE.LOW, CONFIDENCE.MEDIOCRE, CONFIDENCE.MEDIUM];

export const MESSAGE_LOWER_BOUND = 4;
const MESSAGE_UPPER_BOUND = 10;

/**
 * Used to fetch confidence every time the messages change.
 */
export default function useConfidence() {
  const {
    setMessages,
    messages,
    setConfidence,
    updatingConfidence,
    setUpdatingConfidence,
    expectedNodes,
    currentMessage,
    setUpdatingExpectedNodes,
  } = useContext(AppContext);
  const { reportUrl, socket } = useContext(ChatContext);

  const updateNodes = useCallback(
    (confidence: Confidence) => {
      const { rating } = confidence;
      if (
        currentMessage > 0 &&
        currentMessage + 1 === messages.length &&
        !messages.some((message) => message.final_report) &&
        LOW_BOUNDARY.includes(rating) &&
        expectedNodes - 1 === messages.length &&
        messages.length >= MESSAGE_LOWER_BOUND &&
        messages.length < MESSAGE_UPPER_BOUND - 1
      ) {
        setUpdatingExpectedNodes(true);
        sendExtendSession(socket.current, expectedNodes + 1);
      }
    },
    [setUpdatingExpectedNodes, currentMessage, socket],
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
        if(!message?.confidence) {
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
}
