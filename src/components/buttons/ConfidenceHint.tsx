import { useContext } from "react";
import { AppContext } from "../../context/AppContext.tsx";
import { showConfidenceDialogue } from "../dialogue/ConfidenceDialogue.tsx";
import { FaHourglassHalf } from "react-icons/fa";
import {useTranslation} from "react-i18next";

const ADVICE_DICTIONARY = new Map();
ADVICE_DICTIONARY.set("outstanding", "advice-generate-advice");
ADVICE_DICTIONARY.set("high", "advice-generate-advice");
ADVICE_DICTIONARY.set("medium", "advice-you-may-want-to-consider");
ADVICE_DICTIONARY.set("mediocre", "advice-proceed-with-questions");
ADVICE_DICTIONARY.set("low", "advice-proceed-with-questions");

/**
 * The confidence icon that can be used to show the confidence dialogue.
 * @constructor
 */
export default function ConfidenceHint({ className }: { className?: string }) {
  const [t] = useTranslation();
  const { confidence, updatingConfidence, currentMessage, expectedNodes, isLast, clarificationClicked } = useContext(AppContext);
  if (!confidence || currentMessage === 0 || currentMessage === expectedNodes - 1 || !isLast || clarificationClicked) return <></>;
  const rating = confidence.rating;
  return (
    <div className={`${className}`}>
      {updatingConfidence && (
        <div className="flex flex-row justify-end">
          <FaHourglassHalf className="w-6 h-6 fill-gray-400" />
        </div>
      )}
      {!updatingConfidence && (
        <a href="#" onClick={showConfidenceDialogue}>
          {t("Hint")}: {t(ADVICE_DICTIONARY.get(rating))}
        </a>
      )}
    </div>
  );
}
