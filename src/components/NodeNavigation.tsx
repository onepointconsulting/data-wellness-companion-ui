import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { JoyrideContext } from "../context/JoyrideContext.tsx";
import { useJoyrideStore } from "../context/JoyrideStore.ts";
import {
  isDisplayReportGenerationMessage,
  useAppStore,
} from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import { messagesOverLowerLimit } from "../lib/confidenceAdapter.ts";
import { ConfidenceImage } from "./buttons/ConfidenceHint.tsx";
import { showConfidenceDialogue } from "./dialogue/ConfidenceDialogue.tsx";
import { t } from "i18next";

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
  const {
    messages,
    currentMessage,
    setCurrentMessageHistory,
    confidence,
    updatingConfidence,
    sending,
  } = useContext(AppContext);
  const { expectedNodes, messageLowerLimit } = useAppStore(
    useShallow((state) => ({ ...state })),
  );
  const isFinalMessage = currentMessage === expectedNodes - 1;
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
            {updatingConfidence || sending ? (
              <img
                src={`confidence-img/thinking.svg`}
                alt={t("recommendations-confidence-degree")}
              />
            ) : (
              <a href="#" onClick={showConfidenceDialogue}>
                <ConfidenceImage rating={confidence?.rating ?? "medium"} />
              </a>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default function NodeNavigation() {
  const {
    currentMessage,
    isLast,
    isReport,
    sending,
    regenerating,
    displayRegistrationMessage,
  } = useContext(AppContext);
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

  if (displayRegistrationMessage) {
    return null;
  }

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
    <div className="min-w-6 ml-2 md:ml-8" ref={navbarRef}>
      {/* <ConfidenceHint /> */}
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
