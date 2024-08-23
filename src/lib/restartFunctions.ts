import {clearSession, getSessionHistory} from "./sessionFunctions.ts";
import {Message} from "../model/message.ts";
import {extractIdParam} from "./urlParamExtraction.ts";

export default function restartCompanion(
  messages: Message[],
  setDisplayRegistrationMessage: (displayRegistrationMessage: boolean) => void,
  setSessionStartTimestamp: (timestamp: Date) => void,
  setChatText: (chatText: string) => void,
) {
  clearSession(messages);
  setChatText("");
  setSessionStartTimestamp(new Date());
  setDisplayRegistrationMessage(getSessionHistory().length > 0 && !extractIdParam());
}
