import { Message } from "../model/message.ts";
import { FaRegLightbulb } from "react-icons/fa6";
import { FaHourglassHalf } from "react-icons/fa";
import { IoContractOutline } from "react-icons/io5";
import { VscExtensions } from "react-icons/vsc";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { ChatContext } from "../context/ChatContext.tsx";
import {
  sendClarifyQuestion,
  sendExtendSession,
} from "../lib/websocketFunctions.ts";
import MarkdownComponent from "./Markdown.tsx";
import { WEBSOCKET_SERVER_COMMAND } from "../model/websocketCommands.ts";

function StatefulIcon({
  show,
  children,
  onClick,
  title,
}: {
  show: boolean;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  title: string;
}) {
  return (
    <>
      {show && (
        <a href="#" onClick={onClick} title={title}>
          {children}
        </a>
      )}
      {!show && <div className="deactivated-icon">{children}</div>}
    </>
  );
}

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
    isBeforeReport,
    expectedNodes,
    updatingExpectedNodes,
    setUpdatingExpectedNodes,
  } = useContext(AppContext);
  const { socket } = useContext(ChatContext);

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
    onChangeExpectedNodes(e, expectedNodes + 1);
  }

  function onShorten(e: React.MouseEvent<HTMLAnchorElement>) {
    onChangeExpectedNodes(e, expectedNodes - 1);
  }

  function onChangeExpectedNodes(
    e: React.MouseEvent<HTMLAnchorElement>,
    newExpectedNodes: number,
  ) {
    e.preventDefault();
    setUpdatingExpectedNodes(true);
    sendExtendSession(socket.current, newExpectedNodes);
  }

  if (currentMessage === 0 || message.final_report) return null;

  const showShorten =
    isLast && !updatingExpectedNodes && !isBeforeReport && expectedNodes > 3;
  const showExtend = isBeforeReport && isLast && !updatingExpectedNodes;

  return (
    <div className="clarification">
      <StatefulIcon
        show={showShorten}
        onClick={onShorten}
        title="Shorten the current session by one step"
      >
        <IoContractOutline />
      </StatefulIcon>
      <StatefulIcon
        show={showExtend}
        onClick={onExtend}
        title="Add one more step to current session"
      >
        <VscExtensions />
      </StatefulIcon>
      {updatingExpectedNodes && <FaHourglassHalf />}
      {!message.clarification && (
        <a href="#" onClick={onClarify} title="Explain the current question">
          <FaRegLightbulb />
        </a>
      )}
      {!message.clarification && clarificationClicked && <FaHourglassHalf />}
      {message.clarification && (
        <section className="clarification-main">
          <MarkdownComponent content={message.clarification} />
        </section>
      )}
    </div>
  );
}
