import { useContext } from "react";
import { AppContext } from "../context/AppContext.tsx";

import { Session } from "../model/session.ts";
import { getSession, saveSession } from "../lib/sessionFunctions.ts";
import {
  SUCCESS,
  askClarification,
  ResponseData,
} from "../lib/boomiApi/apiClient.ts";
import { toast } from "../../@/components/ui/use-toast.ts";
import { useTranslation } from "react-i18next";

export function useClarification() {
  const { t } = useTranslation();
  const { messages, currentMessage, setClarificationClicked } =
    useContext(AppContext);

  function sendErrorMessage() {
    toast({
      title: t("Failed to retrieve clarification."),
      description: t("Failed to retrieve clarification. Try again later"),
    });
  }

  function processClarification() {
    setClarificationClicked(true);
    const session: Session | null = getSession();
    if (!!session) {
      askClarification(session.id, currentMessage + 1)
        .then((response: ResponseData) => {
          const { code } = response;
          if (code === SUCCESS && !!response.data) {
            const activeMessage = messages[currentMessage];
            activeMessage.clarification = response.data["clarification"];
            session.messages[currentMessage] = activeMessage;
            saveSession(session);
          } else {
            sendErrorMessage();
            console.error(
              "Failed to retrieve clarification.",
              response.message,
            );
          }
        })
        .catch((error: Error) => {
          console.error("Failed to retrieve clarification.", error);
          sendErrorMessage();
        })
        .finally(() => {
          setClarificationClicked(false);
        });
    }
  }

  return { processClarification };
}
