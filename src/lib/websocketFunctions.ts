import { Socket } from "socket.io-client";
import { WEBSOCKET_COMMAND } from "../model/websocketCommands.ts";
import { getSession, getSessionHistory } from "./sessionFunctions.ts";
import i18next from "i18next";
import { extractIdParam } from "./urlParamExtraction.ts";
import { StartSession } from "../model/session.ts";
import { ChatType } from "../context/ChatContext.tsx";

const IGNORED_STEPS = -1;

export function getSessionId() {
  const session = getSession();
  return session ? session.id : "";
}

export function sendStartSession(startSession: StartSession) {
  const {
    socket,
    setDisplayRegistrationMessage,
    expectedInteviewSteps,
    apiServer,
    chatType,
  } = startSession;
  if (getSessionHistory().length > 0) {
    const idParam = extractIdParam();
    if (!idParam) {
      // Display registration message if the user is re-using the tool and there is no identifier in the URL.
      setDisplayRegistrationMessage(true);
    } else {
      fetch(`${apiServer}/validate_jwt_token`, {
        method: "POST",
        body: JSON.stringify({ token: idParam }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.info("Token data", data);
          switchSession(
            socket,
            getSessionId(),
            expectedInteviewSteps,
            chatType,
          );
        })
        .catch((error) => {
          console.error("Error validating JWT token", error);
          setDisplayRegistrationMessage(true);
        });
    }
  } else {
    // Start a new session.
    switchSession(socket, getSessionId(), expectedInteviewSteps, chatType);
  }
}

export function switchSession(
  socket: Socket<any, any> | null,
  sessionId: string,
  expectedInteviewSteps: number | null = IGNORED_STEPS,
  chatType: ChatType = ChatType.DIVERGING,
) {
  const client_id = extractIdParam();
  safeEmit(
    socket,
    WEBSOCKET_COMMAND.START_SESSION,
    sessionId,
    expectedInteviewSteps,
    i18next?.language,
    client_id,
    chatType,
  );
}

export function sendClientMessage(
  socket: Socket<any, any> | null,
  answer: string,
) {
  safeEmit(socket, WEBSOCKET_COMMAND.CLIENT_MESSAGE, getSessionId(), answer);
}

export function sendRegenerateMessage(socket: Socket<any, any> | null) {
  safeEmit(socket, WEBSOCKET_COMMAND.REGENERATE_QUESTION, getSessionId());
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

export function generateReportNow(socket: Socket<any, any> | null) {
  safeEmit(socket, WEBSOCKET_COMMAND.GENERATE_REPORT_NOW, getSessionId());
}

function safeEmit(
  socket: Socket<any, any> | null,
  event: string,
  ...args: any[]
) {
  if (!!socket) {
    socket.emit(event, ...args);
    console.info(`Sent ${event} message!`);
  } else {
    console.warn(`Socket is null, cannot send ${event} message.`);
  }
}
