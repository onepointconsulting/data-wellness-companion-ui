import {useContext, useEffect} from "react";
import {AppContext} from "../../context/AppContext.tsx";
import {ChatContext} from "../../context/ChatContext.tsx";
import {Message} from "../../model/message.ts";
import {sendClarifyQuestion} from "../../lib/websocketFunctions.ts";
import {FaRegLightbulb} from "react-icons/fa6";
import {FaHourglassHalf} from "react-icons/fa";


/**
 * The light bulb icon that can be used to get a clarification.
 * @constructor
 */
export default function LightBulb() {
  const {
    isLast,
    currentMessage,
    messages,
    expectedNodes,
    clarificationClicked,
    sending,
    setClarificationClicked,
  } = useContext(AppContext);
  const { socket } = useContext(ChatContext);
  const message: Message = messages[currentMessage];
  const missesClarification = !message?.clarification;

  useEffect(() => {
    setClarificationClicked(false);
  }, [currentMessage]);

  function onClarify(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
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
          <div className="question-mark-icon">
            <a href="#" onClick={onClarify}>
              <FaRegLightbulb className="question-mark-icon-svg" />
            </a>
          </div>
        )}
      {missesClarification && clarificationClicked && isLast && (
        <div className="question-mark-icon">
          <FaHourglassHalf className="question-mark-icon-svg" />
        </div>
      )}
    </>
  );
}