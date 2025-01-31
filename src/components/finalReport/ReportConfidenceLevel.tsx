import { AccordionText } from "../accordion/AccordionText.tsx";
import { Confidence } from "../../model/confidence.ts";
import { confidenceAdapter } from "../../lib/confidenceAdapter.ts";
import { useTranslation } from "react-i18next";

export default function ReportConfidenceLevel({
  confidence,
}: {
  confidence: Confidence;
}) {
  const { t } = useTranslation();
  return (
    <AccordionText title={"D-Well confidence degree"}>
      <p className="confidence-text font-bold">
        <code>{confidenceAdapter(t, confidence)}</code>
      </p>
      <p className="confidence-text">{confidence.reasoning}</p>
    </AccordionText>
  );
}
