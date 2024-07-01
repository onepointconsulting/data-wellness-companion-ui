import { useContext } from "react";
import { AppContext } from "../../context/AppContext.tsx";
import { showConfidenceDialogue } from "../dialogue/ConfidenceDialogue.tsx";
import { FaHourglassHalf } from "react-icons/fa";

const CONFIDENCE_DICTIONARY = new Map();
CONFIDENCE_DICTIONARY.set("high", "high-confidence.svg");
CONFIDENCE_DICTIONARY.set("outstanding", "high-confidence.svg");
CONFIDENCE_DICTIONARY.set("medium", "medium-confidence.svg");
CONFIDENCE_DICTIONARY.set("mediocre", "low-confidence.svg");
CONFIDENCE_DICTIONARY.set("low", "low-confidence.svg");

/**
 * The confidence icon that can be used to show the confidence dialogue.
 * @constructor
 */
export default function ConfidenceIcon({ className }: { className?: string }) {
  const { confidence, updatingConfidence } = useContext(AppContext);
  if (!confidence) return <></>;
  const rating = confidence.rating;
  const image = (() =>
    CONFIDENCE_DICTIONARY.get(rating) || "low-confidence.svg")();
  return (
    <div className={`relative w-9 h-9 md:w-11 md:h-11 ${className}`}>
      {updatingConfidence && (
        <div className="flex flex-row justify-center">
          <FaHourglassHalf className="w-6 h-6 fill-gray-400" />
        </div>
      )}
      {!updatingConfidence && (
        <a href="#" onClick={showConfidenceDialogue}>
          <img
            src={`./confidence-img/${image}`}
            alt={confidence.reasoning}
            title={confidence.reasoning}
            className="absolute top-0 right-0"
          />
        </a>
      )}
    </div>
  );
}
