import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../context/AppContext.tsx";
import onCloseDialogue, { showDialogue } from "../../lib/dialogFunctions.ts";
import MarkdownComponent from "../Markdown.tsx";
import ConfidenceIcon from "../buttons/ConfidenceIcon.tsx";
import { CircularProgressbar } from "react-circular-progressbar";
import ConfidenceLevel from "./ConfidenceLevel.tsx";
import { getNumericRating } from "../../lib/getNumericRating .ts";

export const CONFIDENCE_DIALOGUE_ID = "confidence-dialogue";

export function showConfidenceDialogue(
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
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

  const numericRating = confidence ? getNumericRating(confidence.rating) : 0;

  const confidenceWithNumericRating = confidence
    ? { ...confidence, rating: numericRating }
    : null;

  return (
    <div className="p-2">
      {/* Title */}
      <div className="my-4 text-lg font-bold text-center">
        {t("Explanation of Confidence Level")}
      </div>

      <div className="flex flex-col px-2.5 items-center">
        <ConfidenceLevel confidence={confidenceWithNumericRating} />
        <p className="my-4 text-xl">
          {confidence?.rating ? t(`confidence_${confidence?.rating}`) : "👁🕵️"}
        </p>

        <div className="pt-2 text-base">
          <MarkdownComponent content={confidence?.reasoning || ""} />
        </div>
      </div>
    </div>
  );
}
