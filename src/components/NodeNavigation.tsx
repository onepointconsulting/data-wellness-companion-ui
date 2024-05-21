import i18next from "i18next";
import { useContext } from "react";
import { FaFlagCheckered } from "react-icons/fa";
import { VscDebugStart } from "react-icons/vsc";
import { AppContext } from "../context/AppContext.tsx";

function OutputNode({ i, totalNodes }: { i: number; totalNodes: number }) {
  if (i === 0) {
    return <VscDebugStart className="w-8 h-8 mx-auto md:w-10 md:h-10" />;
  }
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
        <div className={`connector ${connectorCovered ? "active" : ""}`}></div>
      )}
    </>
  );
}

export default function NodeNavigation() {
  const { expectedNodes } = useContext(AppContext);

  // TODO: Add rtl support
  const checkLanguage = i18next.language;
  console.log("checkLanguage", checkLanguage);
  return (
    <div className="node-container">
      {[...Array(expectedNodes).keys()].map((i) => {
        return (
          <SingleNode expectedNodes={expectedNodes} i={i} key={`node_${i}`} />
        );
      })}
    </div>
  );
}
