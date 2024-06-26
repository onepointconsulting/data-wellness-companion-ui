import { clearSession } from "./sessionFunctions.ts";
import { sendStartSession } from "./websocketFunctions.ts";
import { Message } from "../model/message.ts";
import { Socket } from "socket.io-client";

export default function restartCompanion(
  messages: Message[],
  socket: React.MutableRefObject<Socket | null>,
  expectedInterviewSteps: number,
  setDisplayRegistrationMessage: (displayRegistrationMessage: boolean) => void,
  setChatText: (chatText: string) => void,
) {
  clearSession(messages);
  sendStartSession(
    socket.current,
    expectedInterviewSteps,
    setDisplayRegistrationMessage,
  );
  setChatText("");
}
