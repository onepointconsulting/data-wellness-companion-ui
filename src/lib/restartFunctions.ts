import {clearSession} from "./sessionFunctions.ts";
import {Message} from "../model/message.ts";
import {DEFAULT_EXPECTED_NODES} from "../context/AppContext.tsx";

export default function restartCompanion(
  messages: Message[],
  setDisplayRegistrationMessage: (displayRegistrationMessage: boolean) => void,
  setSessionStartTimestamp: (timestamp: Date) => void,
  setCurrentMessageHistory: (currentMessageHistory: number) => void,
  setExpectedNodes: (expectedNodes: number) => void,
  setChatText: (chatText: string) => void,
) {
  clearSession(messages);
  setSessionStartTimestamp(new Date());
  setCurrentMessageHistory(0);
  setExpectedNodes(DEFAULT_EXPECTED_NODES);
  setChatText("");
}
