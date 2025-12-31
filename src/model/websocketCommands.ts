// Send
export const WEBSOCKET_COMMAND = {
  START_SESSION: "start_session",
  CLIENT_MESSAGE: "client_message",
  CLARIFY_QUESTION: "clarify_question",
  EXTEND_SESSION: "extend_session",
  GENERATE_REPORT_NOW: "generate_report_now",
  REGENERATE_QUESTION: "regenerate_question",
  ADD_MORE_SUGGESTIONS: "add_more_suggestions",
  GENERATE_DEEP_RESEARCH: "generate_deep_research",
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
  ADD_MORE_SUGGESTIONS: "add_more_suggestions",
  ERROR: "error",
  DEEP_RESEARCH_UPDATE: "deep_research_update",
  DEEP_RESEARCH_COMPLETE: "deep_research_complete",
};
