import {Message} from "../model/message.ts";
import {FaHourglassHalf} from "react-icons/fa";
import {useContext, useEffect} from "react";
import {AppContext} from "../context/AppContext.tsx";
import {ChatContext} from "../context/ChatContext.tsx";
import MarkdownComponent from "./Markdown.tsx";
import {WEBSOCKET_SERVER_COMMAND} from "../model/websocketCommands.ts";

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
  } = useContext(AppContext);
  const { socket } = useContext(ChatContext);

  const message: Message = messages[currentMessage];

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

  return (
    <div className="clarification">
      {updatingExpectedNodes && <FaHourglassHalf />}
      {message.clarification && (
        <section className="clarification-main">
          <MarkdownComponent content={message.clarification} />
        </section>
      )}
    </div>
  );
}
