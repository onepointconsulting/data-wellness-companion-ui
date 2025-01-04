// Send
export const WEBSOCKET_COMMAND = {
  START_SESSION: "start_session",
  CLIENT_MESSAGE: "client_message",
  CLARIFY_QUESTION: "clarify_question",
  EXTEND_SESSION: "extend_session",
  GENERATE_REPORT_NOW: "generate_report_now",
  REGENERATE_QUESTION: "regenerate_question",
};

// Receive
export const WEBSOCKET_SERVER_COMMAND = {
  START_SESSION: "start_session",
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  SERVER_MESSAGE: "server_message",
  CLARIFICATION_TOKEN: "clarification_token",
  EXTEND_SESSION: "extend_session",
  REGENERATE_QUESTION: "regenerate_question",
  ERROR: "error",
};
