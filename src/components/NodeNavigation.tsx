import {useContext} from "react";
import {AppContext} from "../context/AppContext.tsx";
import {useTranslation} from "react-i18next";


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
  const [t] = useTranslation();
  const { messages, currentMessage, setCurrentMessageHistory } =
    useContext(AppContext);
  const length = messages.length;
  const covered = length > i;

  function handleClick(e: React.MouseEvent) {
      e.preventDefault();
      setCurrentMessageHistory(i);
  }

  const isLastNode = i === expectedNodes - 1;

  return (
    <>
      <div
        className={`node ${covered ? "active" : ""} ${currentMessage === i ? "current" : ""}${isLastNode ? " last-node" : ""}`}
        onClick={(e) => i < length && handleClick(e)}
      >
        {currentMessage === i && <div className="navigation-icon">{isLastNode ? <img src="./navigation-icon.svg" alt={t("navigation icon")}/> : <img src="./navigation-icon.svg" alt={t("navigation icon")}/>}</div>}
      </div>
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
              <SingleNode key={`node_${i}`} expectedNodes={expectedNodes} i={i} />
          );
        })}
    </div>
  );
}
