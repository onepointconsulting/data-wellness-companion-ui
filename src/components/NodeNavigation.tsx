import { useContext } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { FaFlagCheckered } from "react-icons/fa";

function OutputNode({ i, totalNodes }: { i: number; totalNodes: number }) {
  if (i === totalNodes - 1) {
    return <FaFlagCheckered className="mx-auto" />;
  }
  return <>{i + 1}</>;
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
  const { expectedNodes } = useContext(AppContext);

  return (
    <div className="node-container">
      {!!expectedNodes &&
        expectedNodes > 0 &&
        [...Array(expectedNodes).keys()].map((i) => {
          return (
            <div key={`node_${i}`} className="relative">
              <SingleNode expectedNodes={expectedNodes} i={i} />
            </div>
          );
        })}
    </div>
  );
}
