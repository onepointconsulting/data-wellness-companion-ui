import { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext.tsx";
import { Message } from "../../model/message.ts";
import { FaHourglassHalf } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useClarification } from "../../hooks/useClarification.ts";

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
  const message: Message = messages[currentMessage];
  const missesClarification = !message?.clarification;
  const { processClarification } = useClarification();

  useEffect(() => {
    setClarificationClicked(false);
  }, [currentMessage]);

  function onClarify(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    setClarificationClicked(true);
    processClarification();
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
              <IoIosInformationCircleOutline className="question-mark-icon-svg" />
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
