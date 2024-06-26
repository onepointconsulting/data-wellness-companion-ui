import { Message } from "../model/message.ts";
import { FaHourglassHalf } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { ChatContext } from "../context/ChatContext.tsx";
import MarkdownComponent from "./Markdown.tsx";
import { WEBSOCKET_SERVER_COMMAND } from "../model/websocketCommands.ts";
import { GrContract, GrExpand } from "react-icons/gr";

/**
 * Used to display the question clarification.
 * @constructor
 */
export default function ExtraFunctionButtons() {
  const {
    currentMessage,
    messages,
    setMessages,
    updatingExpectedNodes,
    clarificationClicked,
  } = useContext(AppContext);
  const { socket } = useContext(ChatContext);
  const [showClarification, setShowClarification] = useState(true);

  const message: Message = messages[currentMessage];

  useEffect(() => {
    setShowClarification(true);
  }, [clarificationClicked]);

  function onClarificationToken(token: string) {
    if (messages.length > 0) {
      const activeMessage = messages[currentMessage];
      if (activeMessage.clarification === undefined) {
        activeMessage.clarification = token ?? "";
      } else {
        activeMessage.clarification += token;
      }
      setMessages([...messages]);
    }
  }

  useEffect(() => {
    if (socket.current === null) return;
    socket.current.on(
      WEBSOCKET_SERVER_COMMAND.CLARIFICATION_TOKEN,
      onClarificationToken,
    );
    return () => {
      socket.current?.off(
        WEBSOCKET_SERVER_COMMAND.CLARIFICATION_TOKEN,
        onClarificationToken,
      );
    };
  }, [currentMessage]);

  if (currentMessage === 0 || message.final_report) return null;

  console.log("showClarification", showClarification);

  return (
    <div className="clarification">
      {updatingExpectedNodes && <FaHourglassHalf />}
      {message.clarification && (
        <section
          className={`clarification-main relative ${showClarification ? "expanded" : "contracted"}`}
        >
          <MarkdownComponent content={message.clarification} />
          <div className="clarification-contract">
            {showClarification && (
              <GrContract onClick={() => setShowClarification(false)} />
            )}
            {!showClarification && (
              <GrExpand onClick={() => setShowClarification(true)} />
            )}
          </div>
        </section>
      )}
    </div>
  );
}
