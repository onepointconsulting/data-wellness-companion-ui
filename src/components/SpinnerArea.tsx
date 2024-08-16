import Spinner from "./Spinner.tsx";
import {useTranslation} from "react-i18next";
import ErrorMessage from "./message/ErrorMessage.tsx";

export default function SpinnerArea({
                                      sending,
                                      displayReportGenerationMessage,
                                      errorMessage
                                    }: {
  sending: boolean;
  displayReportGenerationMessage: boolean;
  errorMessage: string | undefined;
}) {
  const [t] = useTranslation();
  return (
    <>
      {sending && (
        <>
          {!errorMessage && <div className="mt-6 mb-8">
            <Spinner/>
          </div>}
          {!errorMessage && displayReportGenerationMessage && (
            <div className="final-report-message mt-10 mb-2">
              {t("Generating final report. This might take 2 to 3 minutes...")}
            </div>
          )}
          {!!errorMessage && <ErrorMessage error={errorMessage}/>}
        </>
      )}
    </>
  );
}
