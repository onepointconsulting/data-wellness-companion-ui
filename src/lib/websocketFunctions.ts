import { Socket } from "socket.io-client";
import { WEBSOCKET_COMMAND } from "../model/websocketCommands.ts";
import { getSession, getSessionHistory } from "./sessionFunctions.ts";

const ONEPOINT_ID_PARAM = "onepoint_id";

function getSessionId() {
  const session = getSession();
  return session ? session.id : "";
}

export function sendStartSession(
  socket: Socket<any, any> | null,
  expectedInteviewSteps: number | null,
  setDisplayRegistrationMessage: (displayRegistrationMessage: boolean) => void,
) {
  const params = new URLSearchParams(window.location.search);
  if (getSessionHistory().length > 0 && !params.get(ONEPOINT_ID_PARAM)) {
    setDisplayRegistrationMessage(true);
  } else {
    safeEmit(
      socket,
      WEBSOCKET_COMMAND.START_SESSION,
      getSessionId(),
      expectedInteviewSteps,
      // other params, like language
    );
  }
}

export function sendClientMessage(
  socket: Socket<any, any> | null,
  answer: string,
) {
  safeEmit(socket, WEBSOCKET_COMMAND.CLIENT_MESSAGE, getSessionId(), answer);
}

export function sendClarifyQuestion(
  socket: Socket<any, any> | null,
  question: string,
) {
  safeEmit(
    socket,
    WEBSOCKET_COMMAND.CLARIFY_QUESTION,
    getSessionId(),
    question,
  );
}

export function sendExtendSession(
  socket: Socket<any, any> | null,
  sessionSteps: number,
) {
  safeEmit(
    socket,
    WEBSOCKET_COMMAND.EXTEND_SESSION,
    getSessionId(),
    sessionSteps,
  );
}

function safeEmit(
  socket: Socket<any, any> | null,
  event: string,
  ...args: any[]
) {
  if (!!socket) {
    socket.emit(event, ...args);
    console.info(`Sent ${event} message`);
  } else {
    console.warn(`Socket is null, cannot send ${event} message.`);
  }
}
