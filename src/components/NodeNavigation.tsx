import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { FaFlagCheckered, FaHourglassHalf } from "react-icons/fa";
import { FaRegLightbulb } from "react-icons/fa6";
import { Message } from "../model/message.ts";
import {
  sendClarifyQuestion,
  sendExtendSession,
} from "../lib/websocketFunctions.ts";
import { ChatContext } from "../context/ChatContext.tsx";
import { IoContractOutline } from "react-icons/io5";
import StatefulIcon from "./buttons/StatefulIcon.tsx";
import { VscExtensions } from "react-icons/vsc";
import ConfidenceIcon from "./buttons/ConfidenceIcon.tsx";

function OutputNode({ i, totalNodes }: { i: number; totalNodes: number }) {
  if (i === totalNodes - 1) {
    return <FaFlagCheckered className="mx-auto" />;
  }
  return <>{i + 1}</>;
}

/**
 * The light bulb icon that can be used to get a clarification.
 * @constructor
 */
function LightBulb({
  i,
  activeMessage,
}: {
  i: number;
  activeMessage: boolean;
}) {
  const {
    isLast,
    currentMessage,
    messages,
    expectedNodes,
    clarificationClicked,
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
        activeMessage &&
        i > 0 &&
        !clarificationClicked &&
        !isRecommendation && (
          <div className="node-extra-icon-container">
            <a href="#" onClick={onClarify}>
              <FaRegLightbulb className="w-6 h-6" />
            </a>
          </div>
        )}
      {missesClarification && clarificationClicked && activeMessage && (
        <div className="node-extra-icon-container">
          <FaHourglassHalf className="w-6 h-6" />
        </div>
      )}
    </>
  );
}

function ShortenSession({
  onShorten,
  showShorten,
}: {
  onShorten: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  showShorten: boolean;
}) {
  if (!showShorten) return <></>;
  return (
    <StatefulIcon
      show={showShorten}
      onClick={onShorten}
      title={"Shorten the current session by one step"}
    >
      <IoContractOutline className="w-6 h-6" />
    </StatefulIcon>
  );
}

function ExtendSession({
  onExtend,
  showExtend,
}: {
  onExtend: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  showExtend: boolean;
}) {
  if (!showExtend) return <></>;
  return (
    <StatefulIcon
      show={showExtend}
      onClick={onExtend}
      title={"Add one more step to current session"}
    >
      <VscExtensions className="w-6 h-6" />
    </StatefulIcon>
  );
}

/**
 * The single node used to display a number and used to navigate through a conversation.
 * @param i
 * @param expectedNodes
 * @constructor
 */
function SingleNode({
  i,
  expectedNodes,
}: {
  i: number;
  expectedNodes: number;
}) {
  const { messages, currentMessage, setCurrentMessageHistory } =
    useContext(AppContext);
  const length = messages.length;
  const covered = length > i;
  const connectorCovered = length > i + 1;
  return (
    <>
      <div
        className={`node ${covered ? "active" : ""} ${currentMessage === i ? "current" : ""}`}
      >
        {i < length ? (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentMessageHistory(i);
            }}
          >
            <OutputNode i={i} totalNodes={expectedNodes} />
          </a>
        ) : (
          <OutputNode i={i} totalNodes={expectedNodes} />
        )}
      </div>
      {i !== expectedNodes - 1 && (
        <div
          className={`connector ${connectorCovered ? "active" : ""} ${i > 0 && i % 6 === 0 ? "node-break" : ""}`}
        ></div>
      )}
    </>
  );
}

export default function NodeNavigation() {
  const {
    expectedNodes,
    currentMessage,
    updatingExpectedNodes,
    setUpdatingExpectedNodes,
    isLast,
    isBeforeReport,
  } = useContext(AppContext);
  const { socket } = useContext(ChatContext);

  function onShorten(e: React.MouseEvent<HTMLAnchorElement>) {
    onChangeExpectedNodes(e, expectedNodes - 1);
  }

  function onExtend(e: React.MouseEvent<HTMLAnchorElement>) {
    onChangeExpectedNodes(e, expectedNodes + 1);
  }

  function onChangeExpectedNodes(
    e: React.MouseEvent<HTMLAnchorElement>,
    newExpectedNodes: number,
  ) {
    e.preventDefault();
    setUpdatingExpectedNodes(true);
    sendExtendSession(socket.current, newExpectedNodes);
  }

  return (
    <div className="node-container">
      {!!expectedNodes && expectedNodes > 0 && [...Array(expectedNodes).keys()].map((i) => {
        const activeMessage = i === currentMessage;
        const showShorten =
          isLast &&
          !updatingExpectedNodes &&
          !isBeforeReport &&
          expectedNodes > 3 &&
          i > 0 &&
          i === currentMessage &&
          expectedNodes !== currentMessage + 1;
        const showExtend =
          isBeforeReport &&
          isLast &&
          !updatingExpectedNodes &&
          i === currentMessage;
        return (
          <div key={`node_${i}`} className="relative">
            <div className="flex flex-row absolute right-10">
              {showExtend && (
                <div className="node-extra-icon-container">
                  <ExtendSession onExtend={onExtend} showExtend={showExtend} />
                </div>
              )}
              {showShorten && (
                <div className="node-extra-icon-container">
                  <ShortenSession
                    onShorten={onShorten}
                    showShorten={showShorten}
                  />
                </div>
              )}
              <LightBulb i={i} activeMessage={activeMessage} />
            </div>
            <SingleNode expectedNodes={expectedNodes} i={i} />
          </div>
        );
      })}
      <ConfidenceIcon />
    </div>
  );
}
