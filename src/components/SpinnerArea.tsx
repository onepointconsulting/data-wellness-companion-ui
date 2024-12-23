import Spinner from "./Spinner.tsx";
import { useTranslation } from "react-i18next";

export default function SpinnerArea({
  sending,
  displayReportGenerationMessage,
}: {
  sending: boolean;
  displayReportGenerationMessage: boolean;
}) {
  const [t] = useTranslation();
  return (
    <>
      {sending && (
        <>
          <div className="mt-6 mb-8">
            <Spinner />
          </div>
          {displayReportGenerationMessage && (
            <div className="final-report-message mt-10 mb-2">
              {t("Generating report. This might take 2 to 3 minutes...")}
            </div>
          )}
        </>
      )}
    </>
  );
}
