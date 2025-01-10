import { useContext } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { Trans, useTranslation } from "react-i18next";
import { confidenceAdapter } from "../lib/confidenceAdapter.ts";
import useGiveMeReportNow from "../hooks/useGiveMeReportNow.ts";

function DecisionButtons({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  const [t] = useTranslation();
  return (
    <div
      className="border-button w-full md:flex-1 cursor-pointer"
      onClick={onClick}
    >
      {t(label)}
    </div>
  );
}

export default function ConfidenceLevelWarning() {
  const [t] = useTranslation();
  const { messages, sending, confidence } = useContext(AppContext);
  if (sending) {
    return <></>;
  }

  const { giveMeReportNow, addMoreQuestions } = useGiveMeReportNow();

  return (
    <div className="px-2 py-2">
      <p>
        <Trans
          key="confidence-level-warning"
          i18nKey="confidence-level-warning"
          components={{ bold: <strong />, br: <br /> }}
          values={{
            confidence: confidenceAdapter(t, confidence),
            steps: messages.length,
          }}
        />
      </p>
      <div className="flex flex-wrap pt-12">
        <DecisionButtons
          label={"Add more questions"}
          onClick={addMoreQuestions}
        />
        <DecisionButtons
          label={"Generate report now"}
          onClick={giveMeReportNow}
        />
      </div>
    </div>
  );
}
