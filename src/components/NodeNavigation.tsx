import { useContext } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { FaFlagCheckered } from "react-icons/fa";
import {
  sendExtendSession,
} from "../lib/websocketFunctions.ts";
import { ChatContext } from "../context/ChatContext.tsx";
import StatefulIcon from "./buttons/StatefulIcon.tsx";
import { VscExtensions } from "react-icons/vsc";

function OutputNode({ i, totalNodes }: { i: number; totalNodes: number }) {
  if (i === totalNodes - 1) {
    return <FaFlagCheckered className="mx-auto" />;
  }
  return <>{i + 1}</>;
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
    sending,
  } = useContext(AppContext);
  const { socket } = useContext(ChatContext);

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
      {!!expectedNodes &&
        expectedNodes > 0 &&
        [...Array(expectedNodes).keys()].map((i) => {
          const showExtend =
            isBeforeReport &&
            !sending &&
            isLast &&
            !updatingExpectedNodes &&
            i === currentMessage;
          return (
            <div key={`node_${i}`} className="relative">
              <div className="flex flex-row absolute right-10">
                {showExtend && (
                  <div className="node-extra-icon-container">
                    <ExtendSession
                      onExtend={onExtend}
                      showExtend={showExtend}
                    />
                  </div>
                )}
              </div>
              <SingleNode expectedNodes={expectedNodes} i={i} />
            </div>
          );
        })}
    </div>
  );
}
