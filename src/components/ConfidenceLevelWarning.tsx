import { useContext } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { Trans, useTranslation } from "react-i18next";
import { ChatContext } from "../context/ChatContext.tsx";
import {
  generateReportNow,
  sendExtendSession,
} from "../lib/websocketFunctions.ts";
import { confidenceAdapter } from "../lib/confidenceAdapter.ts";
import { saveDisplayedConfidenceLevelProceedWarning } from "../lib/confidenceStateFunctions.ts";
import { useAppStore } from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";

function DecisionButtons({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  const [t] = useTranslation();
  return (
    <div
      className="border-button w-full md:flex-1 cursor-pointer"
      onClick={onClick}
    >
      {t(label)}
    </div>
  );
}

export default function ConfidenceLevelWarning() {
  const [t] = useTranslation();
  const {
    messages,
    sending,
    setSending,
    confidence,
    setUpdatingExpectedNodes,
  } = useContext(AppContext);
  const {
    setGeneratingReport,
    messageUpperLimit,
    setDisplayConfidenceLevelProceedWarning,
    setDisplayedConfidenceLevelProceedWarning,
  } = useAppStore(useShallow((state) => ({ ...state })));
  const { socket } = useContext(ChatContext);
  if (sending) {
    return <></>;
  }

  function setDisplayFlags() {
    saveDisplayedConfidenceLevelProceedWarning(
      true,
      setDisplayedConfidenceLevelProceedWarning,
    );
    setDisplayConfidenceLevelProceedWarning(false);
  }

  function addMoreQuestions() {
    setDisplayFlags();
    setUpdatingExpectedNodes(true);
    sendExtendSession(socket.current, messageUpperLimit);
  }

  function giveMeReportNow() {
    setDisplayFlags();
    setSending(true);
    setGeneratingReport(true);
    generateReportNow(socket.current);
  }

  return (
    <div className="px-2 py-2">
      <p>
        <Trans
          key="confidence-level-warning"
          i18nKey="confidence-level-warning"
          components={{ bold: <strong />, br: <br /> }}
          values={{
            confidence: confidenceAdapter(t, confidence),
            steps: messages.length,
          }}
        />
      </p>
      <div className="flex flex-wrap pt-12">
        <DecisionButtons
          label={"Add more questions"}
          onClick={addMoreQuestions}
        />
        <DecisionButtons
          label={"Generate report now"}
          onClick={giveMeReportNow}
        />
      </div>
    </div>
  );
}
