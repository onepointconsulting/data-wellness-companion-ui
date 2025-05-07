import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { useTranslation } from "react-i18next";
import ConfidenceHint from "./buttons/ConfidenceHint.tsx";
import { JoyrideContext } from "../context/JoyrideContext.tsx";
import { useJoyrideStore } from "../context/JoyrideStore.ts";
import {
  isDisplayReportGenerationMessage,
  useAppStore,
} from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import { messagesOverLowerLimit } from "../lib/confidenceAdapter.ts";

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
      css.push("!bg-opacity-30");
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
  const { messages, currentMessage, setCurrentMessageHistory } =
    useContext(AppContext);
  const { expectedNodes, messageLowerLimit } = useAppStore(
    useShallow((state) => ({ ...state })),
  );
  const isFinalMessage = currentMessage === expectedNodes - 1;
  const [t] = useTranslation();

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
        className={`node h-${messagesOverLowerLimit(messages, messageLowerLimit) ? "10" : "[55px]"} ${selectLastNodeCss(covered, currentMessage === i, isLastNode, isFinalMessage)}`}
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
  const { currentMessage, isLast, isReport, sending, regenerating } =
    useContext(AppContext);
  const { expectedNodes } = useAppStore(
    useShallow((state) => ({ expectedNodes: state.expectedNodes })),
  );
  const { navbarRef } = useContext(JoyrideContext);
  const { generatingReport, displayConfidenceLevelProceedWarning } =
    useAppStore(useShallow((state) => ({ ...state })));
  const setNavbarRef = useJoyrideStore((state) => state.setNavbarRef);

  useEffect(() => {
    setNavbarRef();
  }, []);

  const displayReportGenerationMessage = isDisplayReportGenerationMessage(
    currentMessage,
    expectedNodes,
    generatingReport,
    regenerating,
  );

  if (
    (isLast && isReport) ||
    generatingReport ||
    displayConfidenceLevelProceedWarning ||
    (displayReportGenerationMessage && sending)
  ) {
    return null;
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
