import { Message } from "../model/message.ts";
import { useEffect } from "react";
import { appendToSessionHistory, getSession } from "../lib/sessionFunctions.ts";

export default function useSessionHistory(messages: Message[]) {
  useEffect(() => {
    const currentSession = getSession();
    if (currentSession) {
      const hasFinalReport = messages.some((message) => message.final_report);
      if (hasFinalReport) {
        const topic =
          messages.length > 0
            ? messages[0].answer.substring(0, 50) +
              (messages[0].answer.length > 50 ? "..." : "")
            : "New Session";
        appendToSessionHistory(currentSession, hasFinalReport, topic);
      }
    }
  }, [messages]);
}
