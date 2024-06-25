import {useContext, useEffect, useState} from "react";
import { AppContext } from "../context/AppContext.tsx";
import {FaFlagCheckered, FaHourglassHalf} from "react-icons/fa";
import {FaRegLightbulb} from "react-icons/fa6";
import {Message} from "../model/message.ts";
import {sendClarifyQuestion} from "../lib/websocketFunctions.ts";
import {ChatContext} from "../context/ChatContext.tsx";

function OutputNode({ i, totalNodes }: { i: number; totalNodes: number }) {
  if (i === totalNodes - 1) {
    return <FaFlagCheckered className="mx-auto" />;
  }
  return <>{i + 1}</>;
}

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
  const { expectedNodes, isLast, messages, currentMessage } = useContext(AppContext);
  const { socket } = useContext(ChatContext);
  const [clarificationClicked, setClarificationClicked] = useState(false);
  const message: Message = messages[currentMessage];

  useEffect(() => {
    setClarificationClicked(false);
  }, [currentMessage]);

  function onClarify(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const question = message.question;
    setClarificationClicked(true);
    sendClarifyQuestion(socket.current, question);
  }

  return (
    <div className="node-container">
      {[...Array(expectedNodes).keys()].map((i) => {
        const missesClarification = !message?.clarification
        const activeMessage = i === currentMessage
        return (
          <div key={`node_${i}`} className="relative">
            {missesClarification && isLast && activeMessage && i > 0 && !clarificationClicked &&
              <div className="node-extra-icon-container"><a href="#" onClick={onClarify}><FaRegLightbulb className="w-6 h-6" /></a></div>}
            {missesClarification && clarificationClicked && activeMessage && <div className="node-extra-icon-container"><FaHourglassHalf className="w-6 h-6" /></div>}
            <SingleNode expectedNodes={expectedNodes} i={i} />
          </div>
        );
      })}
    </div>
  );
}
