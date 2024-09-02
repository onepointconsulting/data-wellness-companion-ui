import { Message } from "../model/message.ts";
import { FaHourglassHalf } from "react-icons/fa";
import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext.tsx";
import MarkdownComponent from "./Markdown.tsx";
import { GrContract, GrExpand } from "react-icons/gr";
import { toggleOpenClarification } from "../lib/sessionFunctions.ts";

/**
 * Used to display the question clarification.
 * @constructor
 */
export default function ClarificationArea() {
  const {
    currentMessage,
    messages,
    updatingExpectedNodes,
    clarificationClicked,
    showClarification,
    setShowClarification,
  } = useContext(AppContext);
  const clarificationRef = useRef<HTMLDivElement>(null);

  const message: Message = messages[currentMessage];

  useEffect(() => {
    if (clarificationClicked) {
      setShowClarification(true);
    }
  }, [clarificationClicked]);

  function onClarification(state: boolean) {
    setShowClarification(state);
    toggleOpenClarification();
  }

  if (currentMessage === 0 || message.final_report) return null;

  return (
    <div className="clarification">
      {updatingExpectedNodes && "updatingExpectedNodes"}
      {updatingExpectedNodes && <FaHourglassHalf />}
      {message.clarification && (
        <section
          ref={clarificationRef}
          className={`clarification-main relative ${showClarification ? "expanded" : "contracted"}`}
        >
          <MarkdownComponent content={message.clarification} />
          <div className="clarification-contract">
            {showClarification && (
              <GrContract onClick={() => onClarification(false)} />
            )}
            {!showClarification && (
              <GrExpand onClick={() => onClarification(true)} />
            )}
          </div>
        </section>
      )}
    </div>
  );
}
