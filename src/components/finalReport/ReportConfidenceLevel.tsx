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
      <p className="pb-1 font-sans">
        <code>{confidenceAdapter(t, confidence)}</code>
      </p>
      <p className="pb-1 font-sans">{confidence.reasoning}</p>
    </AccordionText>
  );
}
