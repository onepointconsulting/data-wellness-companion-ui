import { Socket } from "socket.io-client";
import { WEBSOCKET_COMMAND } from "../model/websocketCommands.ts";
import { getSession, getSessionHistory } from "./sessionFunctions.ts";
import i18next from "i18next";

const ONEPOINT_ID_PARAM = "onepoint_id";

const ID_PARAM = "id";

const IGNORED_STEPS = -1;

export function getSessionId() {
  const session = getSession();
  return session ? session.id : "";
}

export function sendStartSession(
  socket: Socket<any, any> | null,
  expectedInteviewSteps: number | null,
  setDisplayRegistrationMessage: (displayRegistrationMessage: boolean) => void,
) {
  const params = new URLSearchParams(window.location.search);
  if (
    getSessionHistory().length > 0 &&
    !params.get(ONEPOINT_ID_PARAM) &&
    !params.get(ID_PARAM)
  ) {
    // Display registration message if the user is re-using the tool and there is no identifier in the URL.
    setDisplayRegistrationMessage(true);
  } else {
    // Start a new session.
    switchSession(socket, getSessionId(), expectedInteviewSteps);
  }
}

export function switchSession(
  socket: Socket<any, any> | null,
  sessionId: string,
  expectedInteviewSteps: number | null = IGNORED_STEPS,
) {
  safeEmit(
    socket,
    WEBSOCKET_COMMAND.START_SESSION,
    sessionId,
    expectedInteviewSteps,
    i18next?.language,
  );
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
  const language = i18next?.language;
  safeEmit(
    socket,
    WEBSOCKET_COMMAND.CLARIFY_QUESTION,
    getSessionId(),
    question,
    language,
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
