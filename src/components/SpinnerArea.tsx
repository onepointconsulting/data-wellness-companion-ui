import Spinner from "./Spinner.tsx";
import { useTranslation } from "react-i18next";

export default function SpinnerArea({
  sending,
  message,
}: {
  sending: boolean;
  message?: string;
}) {
  const [t] = useTranslation();
  return (
    <>
      {sending && (
        <>
          <div className="mt-6 mb-8">
            <Spinner />
          </div>
          {message && (
            <div className="final-report-message mt-10 mb-2">
              {t(message)}
            </div>
          )}
        </>
      )}
    </>
  );
}
