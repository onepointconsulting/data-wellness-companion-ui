import {useContext} from "react";
import {AppContext} from "../context/AppContext.tsx";
import {getSession} from "../lib/sessionFunctions.ts";


export default function useConfidenceHint() {
  const {
    updatingConfidence,
    currentMessage,
    messages,
    clarificationClicked,
  } = useContext(AppContext);
  const missingConfidence =
    currentMessage === 0 ||
    messages.length === 0 ||
    clarificationClicked
  const session = getSession()
  const confidence = currentMessage === 0 ? null : session?.messages[currentMessage]?.confidence
  return {missingConfidence, updatingConfidence, confidence}
}