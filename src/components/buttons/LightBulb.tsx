import { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext.tsx";
import { ChatContext } from "../../context/ChatContext.tsx";
import { Message } from "../../model/message.ts";
import { sendClarifyQuestion } from "../../lib/websocketFunctions.ts";
import { FaHourglassHalf } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "../../context/AppStore.ts";

/**
 * The light bulb icon that can be used to get a clarification.
 * @constructor
 */
export default function LightBulb() {
  const {
    showClarification,
    setShowClarification,
    isLast,
    currentMessage,
    messages,
    clarificationClicked,
    sending,
    setClarificationClicked,
  } = useContext(AppContext);
  const { socket } = useContext(ChatContext);
  const { expectedNodes } = useAppStore(
    useShallow((state) => ({ expectedNodes: state.expectedNodes })),
  );
  const message: Message = messages[currentMessage];

  useEffect(() => {
    setClarificationClicked(false);
  }, [currentMessage, messages]);

  function onClarify() {
    if (!message?.clarification) {
      setClarificationClicked(true);
      setShowClarification(true);
      sendClarifyQuestion(socket.current, message.question);
    } else {
      setShowClarification(!showClarification);
    }
  }

  const isRecommendation = expectedNodes === currentMessage + 1;
  const isLoading = clarificationClicked && !message?.clarification;

  return (
    <>
      {isLast && currentMessage > 0 && !sending && !isRecommendation && (
        <span className="question-mark-icon ml-1">
          {isLoading ? (
            <span className="question-mark-icon">
              <FaHourglassHalf className="hour-glass align-middle" />
            </span>
          ) : (
            <button
              className="p-0 m-0 border-none bg-transparent cursor-pointer align-middle"
              onClick={onClarify}
            >
              <IoIosInformationCircleOutline
                className={`question-mark-icon-svg ${showClarification && message?.clarification ? "!fill-[#4a4a4a]" : ""}`}
              />
            </button>
          )}
        </span>
      )}
    </>
  );
}
