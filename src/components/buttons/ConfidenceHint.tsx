import { useContext } from "react";
import { AppContext } from "../../context/AppContext.tsx";
import { showConfidenceDialogue } from "../dialogue/ConfidenceDialogue.tsx";
import { FaHourglassHalf } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ADVICE_DICTIONARY = new Map();
ADVICE_DICTIONARY.set("outstanding", "advice-generate-advice");
ADVICE_DICTIONARY.set("high", "advice-generate-advice");
ADVICE_DICTIONARY.set("medium", "advice-you-may-want-to-consider");
ADVICE_DICTIONARY.set("mediocre", "advice-proceed-with-questions");
ADVICE_DICTIONARY.set("low", "advice-proceed-with-questions");

const IMAGE_MAP = new Map();

IMAGE_MAP.set("outstanding", "good-confidence.svg");
IMAGE_MAP.set("high", "good-confidence.svg");
IMAGE_MAP.set("medium", "medium-confidence.svg");
IMAGE_MAP.set("mediocre", "thinking.svg");
// IMAGE_MAP.set("outstanding", "thinking.svg");

function chooseImage(rating: string) {
  return IMAGE_MAP.get(rating) ?? "thinking.svg";
}

export function ConfidenceImage({
  rating,
  className,
}: {
  rating: string;
  className?: string;
}) {
  const [t] = useTranslation();
  return (
    <img
      src={`confidence-img/${chooseImage(rating)}`}
      alt={t("recommendations-confidence-degree")}
      className={`w-12 h-12 ${className ?? ""}`}
    />
  );
}

/**
 * The confidence icon that can be used to show the confidence dialogue.
 * @constructor
 */
export default function ConfidenceHint({ className }: { className?: string }) {
  const { confidence, updatingConfidence, currentMessage } =
    useContext(AppContext);
  const rating = confidence?.rating;
  const hide = !rating || currentMessage === 0;
  return (
    <div className={`min-h-14 ${className ?? ""}`}>
      {!hide && updatingConfidence && (
        <div className={`flex flex-row justify-end`}>
          <FaHourglassHalf className="w-6 h-6 fill-gray-400" />
        </div>
      )}
      {!hide && !updatingConfidence && (
        <a href="#" onClick={showConfidenceDialogue}>
          <ConfidenceImage rating={rating} />
        </a>
      )}
    </div>
  );
}
