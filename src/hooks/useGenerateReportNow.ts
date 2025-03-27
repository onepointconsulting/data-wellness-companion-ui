import { generateReportNow } from "../lib/websocketFunctions.ts";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { useAppStore } from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import { ChatContext } from "../context/ChatContext.tsx";

export default function useGenerationReportNow() {
  const { setSending } = useContext(AppContext);

  const { setGeneratingReport } = useAppStore(
    useShallow((state) => ({ ...state })),
  );

  const { socket } = useContext(ChatContext);

  function handleGiveMeReportNow() {
    setSending(true);
    setGeneratingReport(true);
    generateReportNow(socket.current);
  }

  return { handleGiveMeReportNow };
}
