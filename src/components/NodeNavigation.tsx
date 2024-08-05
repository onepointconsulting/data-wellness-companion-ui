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
              <FaRegLightbulb
                className="w-8 h-8"
                title={"Please provide more details to clarify your question."}
              />
            </a>
          </div>
        )}

      {missesClarification && clarificationClicked && activeMessage && (
        <div className="node-extra-icon-container">
          <FaHourglassHalf className="w-8 h-8" />
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
      <IoContractOutline className="w-8 h-8" />
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
      <VscExtensions className="w-8 h-8" />
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

  console.log("expectedNodes covered", i !== expectedNodes - 1);
  return (
    <>
      <div
        className={`relative flex items-center z-[132] animate-fade-down animate-ease-in-out animate-normal node ${covered ? "active" : ""} ${currentMessage === i ? "current" : ""}`}
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

      <div
        className={`${i === expectedNodes - 1 ? "ml-[7px]" : "ml-[32px] "} h-auto mx-auto text-2xl rounded-bl-full rounded-br-full mt-[-41px] -z-50`}
      >
        <svg
          className={`node-icon ${covered ? "active" : ""} ${currentMessage === i ? "current" : ""} w-12 h-12`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            d="M3 4a1 1 0 0 0-.822 1.57L6.632 12l-4.454 6.43A1 1 0 0 0 3 20h13.153a1 1 0 0 0 .822-.43l4.847-7a1 1 0 0 0 0-1.14l-4.847-7a1 1 0 0 0-.822-.43H3Z"
            clip-rule="evenodd"
          />
        </svg>
      </div>

      {/* backward icon  */}
      <div
        className={`${i === 0 ? "ml-[3px]" : ""} ml-[-17px] h-auto mx-auto text-2xl rounded-bl-full rounded-br-full mt-[-42px]  -z-50`}
      >
        <svg
          className={`node-icon ${covered ? "active" : ""} ${currentMessage === i ? "current" : ""} w-12 h-12`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            d="M3 4a1 1 0 0 0-.822 1.57L6.632 12l-4.454 6.43A1 1 0 0 0 3 20h13.153a1 1 0 0 0 .822-.43l4.847-7a1 1 0 0 0 0-1.14l-4.847-7a1 1 0 0 0-.822-.43H3Z"
            clip-rule="evenodd"
          />
        </svg>
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
    newExpectedNodes: number
  ) {
    e.preventDefault();
    setUpdatingExpectedNodes(true);
    sendExtendSession(socket.current, newExpectedNodes);
  }

  return (
    <div className="relative flex items-center w-full gap-4 ml-10">
      {[...Array(expectedNodes).keys()].map((i) => {
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
          <div key={`node_${i}`}>
            <div className="absolute right-0 flex">
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

            <div className="node-container ml-[-10px]">
              <SingleNode expectedNodes={expectedNodes} i={i} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
