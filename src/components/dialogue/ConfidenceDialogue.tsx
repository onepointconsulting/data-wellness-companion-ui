import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext.tsx";
import onCloseDialogue, { showDialogue } from "../../lib/dialogFunctions.ts";
import GenericDialogue from "./GenericDialogue.tsx";
import DialogueHeader from "./DialogueHeader.tsx";
import MarkdownComponent from "../Markdown.tsx";
import ConfidenceIcon from "../buttons/ConfidenceIcon.tsx";

export const CONFIDENCE_DIALOGUE_ID = "confidence-dialogue";

export function showConfidenceDialogue(
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
) {
  event.preventDefault();
  onCloseDialogue(CONFIDENCE_DIALOGUE_ID);
  showDialogue(CONFIDENCE_DIALOGUE_ID);
}

/**
 * Shows the confidence score and reasoning.
 * @constructor
 */
export default function ConfidenceDialogue() {
  const { confidence } = useContext(AppContext);
  const { t } = useTranslation();

  return (
    <GenericDialogue
      dialogueId={CONFIDENCE_DIALOGUE_ID}
      clazz="companion-dialogue"
    >
      <DialogueHeader
        onClose={() => onCloseDialogue(CONFIDENCE_DIALOGUE_ID)}
        className="!pl-3 !pr-0 !pt-0"
      >
        <div className="text-lg font-bold">{t("Confidence level")}</div>
      </DialogueHeader>
      <div className="flex flex-col items-start px-2.5">
        <div className="text-2xl font-bold pt-2">
          {confidence?.rating ? t(`confidence_${confidence?.rating}`) : "???"}
        </div>
        <div className="text-base pt-2 mx-auto">
          <ConfidenceIcon className="!w-[5rem] !h-[5rem] md:!w-[8rem] md:!h-[8rem]" />
        </div>
        <div className="text-base pt-2">
          <MarkdownComponent content={confidence?.reasoning || ""} />
        </div>
      </div>
    </GenericDialogue>
  );
}
