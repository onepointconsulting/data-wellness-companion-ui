import { useContext } from "react";
import { AppContext } from "../../context/AppContext.tsx";
import { showConfidenceDialogue } from "../dialogue/ConfidenceDialogue.tsx";

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
  const { confidence } = useContext(AppContext);
  if (!confidence) return <></>;
  const rating = confidence.rating;
  const image = (() =>
    CONFIDENCE_DICTIONARY.get(rating) || "low-confidence.svg")();
  return (
    <div className={`relative w-11 h-11 ${className}`}>
      <a href="#" onClick={showConfidenceDialogue}>
        <img
          src={`./confidence-img/${image}`}
          alt={confidence.reasoning}
          title={confidence.reasoning}
          className="absolute right-0 top-0"
        />
      </a>
    </div>
  );
}
