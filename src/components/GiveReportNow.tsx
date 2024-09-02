import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { MESSAGE_LOWER_BOUND } from "../hooks/useConfidence.ts";
import useFinalReport from "../hooks/useFinalReport.ts";

export default function GiveReportNow() {
  const [t] = useTranslation();
  const { currentMessage, messages, sending } = useContext(AppContext);
  const { generateReport } = useFinalReport();

  const handleGiveReportNow = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    generateReport();
  };

  if (
    currentMessage + 1 <= MESSAGE_LOWER_BOUND ||
    messages.length - 1 !== currentMessage ||
    sending
  ) {
    return null;
  } else {
    return (
      <div className="text-right pr-3">
        <a href="#" onClick={handleGiveReportNow} className="underline">
          {t("Give me the report NOW")}
        </a>
      </div>
    );
  }
}
