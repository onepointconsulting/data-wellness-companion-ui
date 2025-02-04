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
import { ReactNode } from "react";
import { MdAdd, MdOutlineArticle } from "react-icons/md";

function DecisionButtons({
  label,
  onClick,
  icon: Icon,
}: {
  label: string;
  onClick: () => void;
  icon: ReactNode;
}) {
  const [t] = useTranslation();
  return (
    <div className="border-button gap-2 cursor-pointer" onClick={onClick}>
      {Icon}
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
    <div className="">
      <p className="text-xl color-[#4a4a4a] mt-8">
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
      <div className="flex flex-wrap pt-12 gap-6">
        <DecisionButtons
          label={"Add more questions"}
          onClick={addMoreQuestions}
          icon={<MdAdd className="w-8 h-8" />}
        />
        <DecisionButtons
          label={"Generate report now"}
          onClick={giveMeReportNow}
          icon={<MdOutlineArticle className="w-8 h-8" />}
        />
      </div>
    </div>
  );
}
