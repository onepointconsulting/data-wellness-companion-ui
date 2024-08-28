import {useContext} from "react";
import {AppContext} from "../context/AppContext.tsx";
import {finalReport, SUCCESS} from "../lib/boomiApi/apiClient.ts";
import {getSession} from "../lib/sessionFunctions.ts";
import {useTranslation} from "react-i18next";
import { toast } from "../../@/components/ui/use-toast.ts";
import {useFinalReportData} from "./useUserAnswer.ts";

export default function useFinalReport() {
  const {t} = useTranslation();
  const {currentMessage, setSending, setGeneratingReport} =
    useContext(AppContext);
  const {processData} = useFinalReportData();

  function sendErrorMessage() {
    toast({
      title: t("Error: failed to generate final report."),
      description: t("Error: Failed to generate final report. Try again later"),
    });
  }

  function generateReport() {

    setSending(true);
    setGeneratingReport(true);

    const session = getSession();
    if (!!session?.id) {
      finalReport(session.id, currentMessage + 1)
        .then((response) => {
          const {code, data} = response;
          if (code === SUCCESS && !!data) {
            const hasRecommendations = !!data.recommendations;
            if (hasRecommendations) {
              processData(data);
            } else {
              console.error("Report generated without recommendationa", data);
              sendErrorMessage()
            }
          } else {
            console.error("Failed to generate final report", data);
            sendErrorMessage()
          }
        })
        .catch((error) => {
          console.error("Failed to generate final report", error);
          sendErrorMessage()
        })
        .finally(() => {
          setSending(false);
          setGeneratingReport(false);
        })
    } else {
      sendErrorMessage()
    }
  }

  return {generateReport}
}