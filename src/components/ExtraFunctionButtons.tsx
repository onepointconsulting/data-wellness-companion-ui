import {Message} from "../model/message.ts";
import {FaRegLightbulb} from "react-icons/fa6";
import {FaHourglassHalf} from "react-icons/fa";
import {VscExtensions} from "react-icons/vsc";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../context/AppContext.tsx";
import {ChatContext} from "../context/ChatContext.tsx";
import {sendClarifyQuestion, sendExtendSession} from "../lib/websocketFunctions.ts";
import MarkdownComponent from "./Markdown.tsx";
import {WEBSOCKET_SERVER_COMMAND} from "../model/websocketCommands.ts";

/**
 * Used to display the question clarification.
 * @constructor
 */
export default function ExtraFunctionButtons() {
  const [clarificationClicked, setClarificationClicked] = useState(false);
  const {
    currentMessage,
    messages,
    setMessages,
    isLast,
    expectedNodes,
    updatingExpectedNodes,
    setUpdatingExpectedNodes
  } = useContext(AppContext);
  const {socket} = useContext(ChatContext);

  const message: Message = messages[currentMessage];

  function onClarificationToken(token: string) {
    if (messages.length > 0) {
      const activeMessage = messages[currentMessage];
      if (activeMessage.clarification === undefined) {
        activeMessage.clarification = token;
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
  }, [currentMessage, messages]);

  useEffect(() => {
    setClarificationClicked(false);
  }, [currentMessage]);

  function onClarify(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const question = message.question;
    setClarificationClicked(true);
    sendClarifyQuestion(socket.current, question);
  }

  function onExtend(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    setUpdatingExpectedNodes(true);
    sendExtendSession(socket.current, expectedNodes + 1);
  }

  if (currentMessage === 0 || message.final_report) return null;

  return (
    <div className="clarification">
      {isLast && !updatingExpectedNodes &&
        <a href="#" onClick={onExtend} title="Add one more step to current session"><VscExtensions/></a>}
      {updatingExpectedNodes && <FaHourglassHalf/>}
      {!message.clarification && (
        <a href="#" onClick={onClarify} title="Explain the current question">
          <FaRegLightbulb/>
        </a>
      )}
      {!message.clarification && clarificationClicked && <FaHourglassHalf/>}
      {message.clarification && (
        <section className="clarification-main">
          <MarkdownComponent content={message.clarification}/>
        </section>
      )}
    </div>
  );
}
