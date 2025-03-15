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
  const missesClarification = !message?.clarification;

  useEffect(() => {
    setClarificationClicked(false);
  }, [currentMessage, messages]);

  function onClarify() {
    const question = message.question;
    setClarificationClicked(true);
    sendClarifyQuestion(socket.current, question);
  }

  const isRecommendation = expectedNodes === currentMessage + 1;

  return (
    <>
      {missesClarification &&
        isLast &&
        currentMessage > 0 &&
        !sending &&
        !clarificationClicked &&
        !isRecommendation && (
          <div className="question-mark-icon relative top-0.5">
            <button onClick={onClarify}>
              <IoIosInformationCircleOutline className="question-mark-icon-svg" />
            </button>
          </div>
        )}
      {missesClarification && clarificationClicked && isLast && (
        <div className="question-mark-icon">
          <FaHourglassHalf className="hour-glass" />
        </div>
      )}
    </>
  );
}
