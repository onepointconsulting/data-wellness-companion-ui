import { MessageType } from "../model.ts";

export interface ReportState {
  emailsStr: string;
  emails: string[];
  emailsValid: boolean;
  tokenStr: string;
  tokens: string[];
  processing: boolean;
  message: string;
  messageType?: MessageType;
  disabled: boolean;
  language: string;
}

export const reportInitialState: ReportState = {
  emailsStr: "",
  emails: [],
  tokenStr: "",
  tokens: [],
  emailsValid: false,
  processing: false,
  message: "",
  disabled: true,
  language: "en",
};

export type ReportAction =
  | { type: "sending" }
  | { type: "sent" }
  | { type: "setEmailsStr"; emailsStr: string }
  | { type: "setTokenStr"; tokenStr: string }
  | { type: "setLanguage"; language: string }
  | { type: "reset" }
  | { type: "setMessage"; message: string; messageType: MessageType };

export function reportReducer(state: ReportState, action: ReportAction) {
  const { type } = action;
  switch (type) {
    case "setEmailsStr": {
      const { emailsStr } = action;
      const emails = emailsStr.trim().split("\n");
      const emailsValid = emails.every((email) =>
        email.trim().match(/^\S+@\S+\.\S+$/),
      );
      return {
        ...state,
        emails,
        emailsStr,
        emailsValid,
        disabled: emailsStr.trim().length === 0 || !emailsValid,
      };
    }
    case "setTokenStr": {
      const { tokenStr } = action;
      const tokens = tokenStr.split(",");
      return {
        ...state,
        tokenStr,
        tokens,
        disabled: state.emailsStr.trim().length === 0,
      };
    }
    case "setLanguage": {
      return {
        ...state,
        language: action.language,
      };
    }
    case "sending": {
      return {
        ...state,
        processing: true,
        message: "",
      };
    }
    case "sent": {
      return {
        ...state,
        processing: false,
      };
    }
    case "setMessage": {
      return {
        ...state,
        message: action.message,
        messageType: action.messageType,
        processing: false,
      };
    }
    case "reset": {
      return {
        ...state,
        emailsStr: "",
        emails: [],
        emailsValid: false,
        tokenStr: "",
        tokens: [],
        processing: false,
        message: "",
        disabled: true,
      };
    }
  }
}
