import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { useTranslation } from "react-i18next";
import ConfidenceHint from "./buttons/ConfidenceHint.tsx";
import { JoyrideContext } from "../context/JoyrideContext.tsx";
import { useJoyrideStore } from "../context/JoyrideStore.ts";
import {useAppStore} from "../context/AppStore.ts";
import {useShallow} from "zustand/react/shallow";

function selectLastNodeCss(
  covered: boolean,
  current: boolean,
  isLastNode: boolean,
  isFinalMessage: boolean,
) {
  const css = [];
  if (covered) {
    css.push("active");
  }
  if (current) {
    css.push("current");
  }
  if (isLastNode) {
    css.push("last-node");
    if (isFinalMessage) {
      css.push("!bg-opacity-0");
    }
  }
  return css.join(" ");
}

/**
 * The single node used to display a number and used to navigate through a conversation.
 * @param i
 * @param expectedNodes
 * @constructor
 */
function SingleNode({ i }: { i: number }) {
  const { expectedNodes, isFinalMessage } = useContext(AppContext);
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
        className={`node ${selectLastNodeCss(covered, currentMessage === i, isLastNode, isFinalMessage)}`}
        onClick={(e) => i < length && handleClick(e)}
      >
        {currentMessage === i && (
          <div className="navigation-icon">
            <img src="./navigation-icon.svg" alt={t("navigation icon")} />
          </div>
        )}
      </div>
    </>
  );
}

export default function NodeNavigation() {
  const { expectedNodes, isLast, isReport } = useContext(AppContext);
  const { navbarRef } = useContext(JoyrideContext);
  const { generatingReport } =
      useAppStore(useShallow((state) => ({ generatingReport: state.generatingReport })));
  const setNavbarRef = useJoyrideStore((state) => state.setNavbarRef);

  useEffect(() => {
    setNavbarRef();
  }, []);

  if (isLast && isReport || generatingReport) {
    return <></>;
  }

  return (
    <div className="min-w-12" ref={navbarRef}>
      <ConfidenceHint />
      <div className="node-container my-2">
        {!!expectedNodes &&
          expectedNodes > 0 &&
          [...Array(expectedNodes).keys()].map((i) => {
            return <SingleNode key={`node_${i}`} i={i} />;
          })}
      </div>
    </div>
  );
}
