import {useContext} from "react";
import {AppContext} from "../context/AppContext.tsx";


export default function useConfidenceHint() {
  const {
    confidence,
    updatingConfidence,
    currentMessage,
    messages,
    clarificationClicked,
  } = useContext(AppContext);
  const missingConfidence = !confidence ||
    currentMessage === 0 ||
    messages.length === 0 ||
    messages[currentMessage].final_report ||
    clarificationClicked
  return {missingConfidence, updatingConfidence, confidence}
}