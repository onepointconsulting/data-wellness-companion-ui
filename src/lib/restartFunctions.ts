import { clearSession } from "./sessionFunctions.ts";
import { sendStartSession } from "./websocketFunctions.ts";
import { Message } from "../model/message.ts";
import { Socket } from "socket.io-client";
import { DEFAULT_EXPECTED_NODES } from "../context/AppContext.tsx";

export default function restartCompanion(
  messages: Message[],
  socket: React.MutableRefObject<Socket | null>,
  setDisplayRegistrationMessage: (displayRegistrationMessage: boolean) => void,
  setChatText: (chatText: string) => void,
) {
  clearSession(messages);
  sendStartSession(
    socket.current,
    DEFAULT_EXPECTED_NODES,
    setDisplayRegistrationMessage,
  );
  setChatText("");
}
