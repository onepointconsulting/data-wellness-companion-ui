import { showDialogue } from "../../lib/dialogFunctions.ts";
import { INFO_DIALOGUE_ID } from "../dialogue/InfoDialogue.tsx";
import MenuItemTemplate from "./MenuItemTemplate.tsx";
import InfoImage from "./InfoImage.tsx";

function showInfoDialogue() {
  showDialogue(INFO_DIALOGUE_ID);
}

export default function InfoButton() {
  return (
    <MenuItemTemplate title="About" func={showInfoDialogue}>
      <InfoImage />
    </MenuItemTemplate>
  );
}
