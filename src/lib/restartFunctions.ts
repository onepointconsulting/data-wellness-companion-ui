import { clearSession } from "./sessionFunctions.ts";
import { sendStartSession } from "./websocketFunctions.ts";
import { Message } from "../model/message.ts";
import { Socket } from "socket.io-client";
import { DEFAULT_EXPECTED_NODES } from "../context/AppContext.tsx";
import { readChatTYpeFromLS } from "../context/ChatContext.tsx";

export default function restartCompanion(
  messages: Message[],
  socket: React.MutableRefObject<Socket | null>,
  setDisplayRegistrationMessage: (displayRegistrationMessage: boolean) => void,
  setChatText: (chatText: string) => void,
  reportUrl: string,
) {
  clearSession(messages);
  sendStartSession({
    socket: socket.current,
    expectedInteviewSteps: DEFAULT_EXPECTED_NODES,
    setDisplayRegistrationMessage,
    apiServer: reportUrl,
    chatType: readChatTYpeFromLS(),
  });
  setChatText("");
}
