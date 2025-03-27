import { useContext } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { Trans, useTranslation } from "react-i18next";
import { ChatContext } from "../context/ChatContext.tsx";
import { sendExtendSession } from "../lib/websocketFunctions.ts";
import { confidenceAdapter } from "../lib/confidenceAdapter.ts";
import { saveDisplayedConfidenceLevelProceedWarning } from "../lib/confidenceStateFunctions.ts";
import { useAppStore } from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import { MdAdd, MdOutlineArticle } from "react-icons/md";
import useGenerationReportNow from "../hooks/useGenerateReportNow.ts";
import DecisionButtons from "./buttons/DecisionButton.tsx";

export default function ConfidenceLevelWarning() {
  const [t] = useTranslation();
  const { messages, sending, confidence, setUpdatingExpectedNodes } =
    useContext(AppContext);
  const {
    messageUpperLimit,
    setDisplayConfidenceLevelProceedWarning,
    setDisplayedConfidenceLevelProceedWarning,
  } = useAppStore(useShallow((state) => ({ ...state })));
  const { socket } = useContext(ChatContext);
  const { handleGiveMeReportNow } = useGenerationReportNow();
  if (sending) {
    return null;
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
    handleGiveMeReportNow();
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
