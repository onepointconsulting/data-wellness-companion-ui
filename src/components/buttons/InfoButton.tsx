import { FaInfoCircle } from "react-icons/fa";
import { showDialogue } from "../../lib/dialogFunctions.ts";

const INFO_DIALOGUE_ID = "info-dialogue";

function showInfoDialogue() {
  showDialogue(INFO_DIALOGUE_ID);
}

export default function InfoButton() {
  return <FaInfoCircle className="info-button" onClick={showInfoDialogue} />;
}
