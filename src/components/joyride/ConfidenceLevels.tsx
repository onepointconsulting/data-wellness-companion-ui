import { useTranslation } from "react-i18next";

const CONFIDENCE_LEVELS = [
  {
    image: "thinking.svg",
    alt: "Instruction: Thinking",
    label: "Instruction: Thinking – cannot predict much",
  },
  {
    image: "low-confidence.svg",
    alt: "Instruction: Low confidence",
    label: "Instruction: Low confidence",
  },
  {
    image: "medium-confidence.svg",
    alt: "Instruction: Medium confidence",
    label: "Instruction: Medium confidence",
  },
  {
    image: "good-confidence.svg",
    alt: "Instruction: High confidence",
    label: "Instruction: High confidence – right time to make recommendations",
  },
];

export default function ConfidenceLevels() {
  const [t] = useTranslation();
  return (
    <>
      {CONFIDENCE_LEVELS.map((cl, index) => {
        const alt = t(cl.alt);
        return (
          <div
            className="flex flex-wrap items-center justify-start"
            key={`cl_${index}`}
          >
            <div className="p-1 w-16 h-16">
              <img src={`./confidence-img/${cl.image}`} alt={alt} title={alt} />
            </div>
            <div className="flex-1 text-left pl-3">{t(cl.label)}</div>
          </div>
        );
      })}
    </>
  );
}
