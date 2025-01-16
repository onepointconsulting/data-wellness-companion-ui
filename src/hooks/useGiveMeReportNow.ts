import {
  generateReportNow,
  sendExtendSession,
} from "../lib/websocketFunctions.ts";
import { saveDisplayedConfidenceLevelProceedWarning } from "../lib/confidenceStateFunctions.ts";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { useAppStore } from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import { ChatContext } from "../context/ChatContext.tsx";

export default function useGiveMeReportNow(): {
  giveMeReportNow: () => void;
  addMoreQuestions: () => void;
} {
  const { setUpdatingExpectedNodes, setSending } = useContext(AppContext);

  const { socket } = useContext(ChatContext);

  const {
    setGeneratingReport,
    setDisplayConfidenceLevelProceedWarning,
    setDisplayedConfidenceLevelProceedWarning,
    messageUpperLimit,
  } = useAppStore(useShallow((state) => ({ ...state })));

  function setDisplayFlags() {
    saveDisplayedConfidenceLevelProceedWarning(
      true,
      setDisplayedConfidenceLevelProceedWarning,
    );
    setDisplayConfidenceLevelProceedWarning(false);
  }

  function giveMeReportNow() {
    setDisplayFlags();
    setSending(true);
    setGeneratingReport(true);
    generateReportNow(socket.current);
  }

  function addMoreQuestions() {
    setDisplayFlags();
    setUpdatingExpectedNodes(true);
    sendExtendSession(socket.current, messageUpperLimit);
  }

  return { giveMeReportNow, addMoreQuestions };
}
