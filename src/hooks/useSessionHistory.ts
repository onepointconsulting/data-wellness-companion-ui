import { Message } from "../model/message.ts";
import { useEffect } from "react";
import { appendToSessionHistory, getSession } from "../lib/sessionFunctions.ts";

export default function useSessionHistory(messages: Message[]) {
  useEffect(() => {
    const currentSession = getSession();
    if (currentSession) {
      const hasFinalReport = messages.some((message) => message.final_report);
      if(hasFinalReport) {
          debugger
          appendToSessionHistory(currentSession, hasFinalReport);
      }
    }
  }, [messages]);
}
